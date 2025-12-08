const encoder = new TextEncoder();
const decoder = new TextDecoder();
function concat(...buffers) {
  const size = buffers.reduce((acc, {
    length
  }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
function encode$1(string) {
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127) {
      throw new TypeError('non-ASCII string encountered in encode()');
    }
    bytes[i] = code;
  }
  return bytes;
}

function encodeBase64(input) {
  if (Uint8Array.prototype.toBase64) {
    return input.toBase64();
  }
  const CHUNK_SIZE = 0x8000;
  const arr = [];
  for (let i = 0; i < input.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(''));
}
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(typeof input === 'string' ? input : decoder.decode(input), {
      alphabet: 'base64url'
    });
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError('The input to be decoded is not correctly encoded.');
  }
}
function encode(input) {
  let unencoded = input;
  if (typeof unencoded === 'string') {
    unencoded = encoder.encode(unencoded);
  }
  if (Uint8Array.prototype.toBase64) {
    return unencoded.toBase64({
      alphabet: 'base64url',
      omitPadding: true
    });
  }
  return encodeBase64(unencoded).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

class JOSEError extends Error {
  static code = 'ERR_JOSE_GENERIC';
  code = 'ERR_JOSE_GENERIC';
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
class JOSENotSupported extends JOSEError {
  static code = 'ERR_JOSE_NOT_SUPPORTED';
  code = 'ERR_JOSE_NOT_SUPPORTED';
}
class JWSInvalid extends JOSEError {
  static code = 'ERR_JWS_INVALID';
  code = 'ERR_JWS_INVALID';
}
class JWTInvalid extends JOSEError {
  static code = 'ERR_JWT_INVALID';
  code = 'ERR_JWT_INVALID';
}

const unusable = (name, prop = 'algorithm.name') => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
const isAlgorithm = (algorithm, name) => algorithm.name === name;
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
  switch (alg) {
    case 'ES256':
      return 'P-256';
    case 'ES384':
      return 'P-384';
    case 'ES512':
      return 'P-521';
    default:
      throw new Error('unreachable');
  }
}
function checkUsage(key, usage) {
  if (!key.usages.includes(usage)) {
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
  }
}
function checkSigCryptoKey(key, alg, usage) {
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      {
        if (!isAlgorithm(key.algorithm, 'HMAC')) throw unusable('HMAC');
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
        break;
      }
    case 'RS256':
    case 'RS384':
    case 'RS512':
      {
        if (!isAlgorithm(key.algorithm, 'RSASSA-PKCS1-v1_5')) throw unusable('RSASSA-PKCS1-v1_5');
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
        break;
      }
    case 'PS256':
    case 'PS384':
    case 'PS512':
      {
        if (!isAlgorithm(key.algorithm, 'RSA-PSS')) throw unusable('RSA-PSS');
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
        break;
      }
    case 'Ed25519':
    case 'EdDSA':
      {
        if (!isAlgorithm(key.algorithm, 'Ed25519')) throw unusable('Ed25519');
        break;
      }
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      {
        if (!isAlgorithm(key.algorithm, alg)) throw unusable(alg);
        break;
      }
    case 'ES256':
    case 'ES384':
    case 'ES512':
      {
        if (!isAlgorithm(key.algorithm, 'ECDSA')) throw unusable('ECDSA');
        const expected = getNamedCurve(alg);
        const actual = key.algorithm.namedCurve;
        if (actual !== expected) throw unusable(expected, 'algorithm.namedCurve');
        break;
      }
    default:
      throw new TypeError('CryptoKey does not support this operation');
  }
  checkUsage(key, usage);
}

function message(msg, actual, ...types) {
  types = types.filter(Boolean);
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(', ')}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === 'function' && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === 'object' && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
const invalidKeyInput = (actual, ...types) => message('Key must be ', actual, ...types);
const withAlg = (alg, actual, ...types) => message(`Key for the ${alg} algorithm must be `, actual, ...types);

const isCryptoKey = key => {
  if (key?.[Symbol.toStringTag] === 'CryptoKey') return true;
  try {
    return key instanceof CryptoKey;
  } catch {
    return false;
  }
};
const isKeyObject = key => key?.[Symbol.toStringTag] === 'KeyObject';
const isKeyLike = key => isCryptoKey(key) || isKeyObject(key);

function isDisjoint(...headers) {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}

const isObjectLike = value => typeof value === 'object' && value !== null;
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}

function checkKeyLength(alg, key) {
  if (alg.startsWith('RS') || alg.startsWith('PS')) {
    const {
      modulusLength
    } = key.algorithm;
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}

const bytesEqual = (a, b) => {
  if (a.byteLength !== b.length) return false;
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
const createASN1State = data => ({
  data,
  pos: 0
});
const parseLength = state => {
  const first = state.data[state.pos++];
  if (first & 0x80) {
    const lengthOfLen = first & 0x7f;
    let length = 0;
    for (let i = 0; i < lengthOfLen; i++) {
      length = length << 8 | state.data[state.pos++];
    }
    return length;
  }
  return first;
};
const expectTag = (state, expectedTag, errorMessage) => {
  if (state.data[state.pos++] !== expectedTag) {
    throw new Error(errorMessage);
  }
};
const getSubarray = (state, length) => {
  const result = state.data.subarray(state.pos, state.pos + length);
  state.pos += length;
  return result;
};
const parseAlgorithmOID = state => {
  expectTag(state, 0x06, 'Expected algorithm OID');
  const oidLen = parseLength(state);
  return getSubarray(state, oidLen);
};
function parsePKCS8Header(state) {
  expectTag(state, 0x30, 'Invalid PKCS#8 structure');
  parseLength(state);
  expectTag(state, 0x02, 'Expected version field');
  const verLen = parseLength(state);
  state.pos += verLen;
  expectTag(state, 0x30, 'Expected algorithm identifier');
  const algIdLen = parseLength(state);
  const algIdStart = state.pos;
  return {
    algIdStart,
    algIdLength: algIdLen
  };
}
const parseECAlgorithmIdentifier = state => {
  const algOid = parseAlgorithmOID(state);
  if (bytesEqual(algOid, [0x2b, 0x65, 0x6e])) {
    return 'X25519';
  }
  if (!bytesEqual(algOid, [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01])) {
    throw new Error('Unsupported key algorithm');
  }
  expectTag(state, 0x06, 'Expected curve OID');
  const curveOidLen = parseLength(state);
  const curveOid = getSubarray(state, curveOidLen);
  for (const {
    name,
    oid
  } of [{
    name: 'P-256',
    oid: [0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]
  }, {
    name: 'P-384',
    oid: [0x2b, 0x81, 0x04, 0x00, 0x22]
  }, {
    name: 'P-521',
    oid: [0x2b, 0x81, 0x04, 0x00, 0x23]
  }]) {
    if (bytesEqual(curveOid, oid)) {
      return name;
    }
  }
  throw new Error('Unsupported named curve');
};
const genericImport = async (keyFormat, keyData, alg, options) => {
  let algorithm;
  let keyUsages;
  const getSigUsages = () => ['sign'];
  const getEncUsages = () => ['decrypt', 'unwrapKey'];
  switch (alg) {
    case 'PS256':
    case 'PS384':
    case 'PS512':
      algorithm = {
        name: 'RSA-PSS',
        hash: `SHA-${alg.slice(-3)}`
      };
      keyUsages = getSigUsages();
      break;
    case 'RS256':
    case 'RS384':
    case 'RS512':
      algorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: `SHA-${alg.slice(-3)}`
      };
      keyUsages = getSigUsages();
      break;
    case 'RSA-OAEP':
    case 'RSA-OAEP-256':
    case 'RSA-OAEP-384':
    case 'RSA-OAEP-512':
      algorithm = {
        name: 'RSA-OAEP',
        hash: `SHA-${parseInt(alg.slice(-3), 10) || 1}`
      };
      keyUsages = getEncUsages();
      break;
    case 'ES256':
    case 'ES384':
    case 'ES512':
      {
        const curveMap = {
          ES256: 'P-256',
          ES384: 'P-384',
          ES512: 'P-521'
        };
        algorithm = {
          name: 'ECDSA',
          namedCurve: curveMap[alg]
        };
        keyUsages = getSigUsages();
        break;
      }
    case 'ECDH-ES':
    case 'ECDH-ES+A128KW':
    case 'ECDH-ES+A192KW':
    case 'ECDH-ES+A256KW':
      {
        try {
          const namedCurve = options.getNamedCurve(keyData);
          algorithm = namedCurve === 'X25519' ? {
            name: 'X25519'
          } : {
            name: 'ECDH',
            namedCurve
          };
        } catch (cause) {
          throw new JOSENotSupported('Invalid or unsupported key format');
        }
        keyUsages = ['deriveBits'];
        break;
      }
    case 'Ed25519':
    case 'EdDSA':
      algorithm = {
        name: 'Ed25519'
      };
      keyUsages = getSigUsages();
      break;
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      algorithm = {
        name: alg
      };
      keyUsages = getSigUsages();
      break;
    default:
      throw new JOSENotSupported('Invalid or unsupported "alg" (Algorithm) value');
  }
  return crypto.subtle.importKey(keyFormat, keyData, algorithm, options?.extractable ?? (false), keyUsages);
};
const processPEMData = (pem, pattern) => {
  return decodeBase64(pem.replace(pattern, ''));
};
const fromPKCS8 = (pem, alg, options) => {
  const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
  let opts = options;
  if (alg?.startsWith?.('ECDH-ES')) {
    opts ||= {};
    opts.getNamedCurve = keyData => {
      const state = createASN1State(keyData);
      parsePKCS8Header(state);
      return parseECAlgorithmIdentifier(state);
    };
  }
  return genericImport('pkcs8', keyData, alg, opts);
};

function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case 'AKP':
      {
        switch (jwk.alg) {
          case 'ML-DSA-44':
          case 'ML-DSA-65':
          case 'ML-DSA-87':
            algorithm = {
              name: jwk.alg
            };
            keyUsages = jwk.priv ? ['sign'] : ['verify'];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
    case 'RSA':
      {
        switch (jwk.alg) {
          case 'PS256':
          case 'PS384':
          case 'PS512':
            algorithm = {
              name: 'RSA-PSS',
              hash: `SHA-${jwk.alg.slice(-3)}`
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'RS256':
          case 'RS384':
          case 'RS512':
            algorithm = {
              name: 'RSASSA-PKCS1-v1_5',
              hash: `SHA-${jwk.alg.slice(-3)}`
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'RSA-OAEP':
          case 'RSA-OAEP-256':
          case 'RSA-OAEP-384':
          case 'RSA-OAEP-512':
            algorithm = {
              name: 'RSA-OAEP',
              hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
            };
            keyUsages = jwk.d ? ['decrypt', 'unwrapKey'] : ['encrypt', 'wrapKey'];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
    case 'EC':
      {
        switch (jwk.alg) {
          case 'ES256':
            algorithm = {
              name: 'ECDSA',
              namedCurve: 'P-256'
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'ES384':
            algorithm = {
              name: 'ECDSA',
              namedCurve: 'P-384'
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'ES512':
            algorithm = {
              name: 'ECDSA',
              namedCurve: 'P-521'
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'ECDH-ES':
          case 'ECDH-ES+A128KW':
          case 'ECDH-ES+A192KW':
          case 'ECDH-ES+A256KW':
            algorithm = {
              name: 'ECDH',
              namedCurve: jwk.crv
            };
            keyUsages = jwk.d ? ['deriveBits'] : [];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
    case 'OKP':
      {
        switch (jwk.alg) {
          case 'Ed25519':
          case 'EdDSA':
            algorithm = {
              name: 'Ed25519'
            };
            keyUsages = jwk.d ? ['sign'] : ['verify'];
            break;
          case 'ECDH-ES':
          case 'ECDH-ES+A128KW':
          case 'ECDH-ES+A192KW':
          case 'ECDH-ES+A256KW':
            algorithm = {
              name: jwk.crv
            };
            keyUsages = jwk.d ? ['deriveBits'] : [];
            break;
          default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return {
    algorithm,
    keyUsages
  };
}
async function jwkToKey(jwk) {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const {
    algorithm,
    keyUsages
  } = subtleMapping(jwk);
  const keyData = {
    ...jwk
  };
  if (keyData.kty !== 'AKP') {
    delete keyData.alg;
  }
  delete keyData.use;
  return crypto.subtle.importKey('jwk', keyData, algorithm, jwk.ext ?? (jwk.d || jwk.priv ? false : true), jwk.key_ops ?? keyUsages);
}

async function importPKCS8(pkcs8, alg, options) {
  if (typeof pkcs8 !== 'string' || pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0) {
    throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
  }
  return fromPKCS8(pkcs8, alg, options);
}

function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === undefined) {
    return new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some(input => typeof input !== 'string' || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== undefined) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}

const isJWK = key => isObject(key) && typeof key.kty === 'string';
const isPrivateJWK = key => key.kty !== 'oct' && (key.kty === 'AKP' && typeof key.priv === 'string' || typeof key.d === 'string');
const isPublicJWK = key => key.kty !== 'oct' && key.d === undefined && key.priv === undefined;
const isSecretJWK = key => key.kty === 'oct' && typeof key.k === 'string';

let cache;
const handleJWK = async (key, jwk, alg, freeze = false) => {
  cache ||= new WeakMap();
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwkToKey({
    ...jwk,
    alg
  });
  if (freeze) Object.freeze(key);
  if (!cached) {
    cache.set(key, {
      [alg]: cryptoKey
    });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
};
const handleKeyObject = (keyObject, alg) => {
  cache ||= new WeakMap();
  let cached = cache.get(keyObject);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const isPublic = keyObject.type === 'public';
  const extractable = isPublic ? true : false;
  let cryptoKey;
  if (keyObject.asymmetricKeyType === 'x25519') {
    switch (alg) {
      case 'ECDH-ES':
      case 'ECDH-ES+A128KW':
      case 'ECDH-ES+A192KW':
      case 'ECDH-ES+A256KW':
        break;
      default:
        throw new TypeError('given KeyObject instance cannot be used for this algorithm');
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, isPublic ? [] : ['deriveBits']);
  }
  if (keyObject.asymmetricKeyType === 'ed25519') {
    if (alg !== 'EdDSA' && alg !== 'Ed25519') {
      throw new TypeError('given KeyObject instance cannot be used for this algorithm');
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [isPublic ? 'verify' : 'sign']);
  }
  switch (keyObject.asymmetricKeyType) {
    case 'ml-dsa-44':
    case 'ml-dsa-65':
    case 'ml-dsa-87':
      {
        if (alg !== keyObject.asymmetricKeyType.toUpperCase()) {
          throw new TypeError('given KeyObject instance cannot be used for this algorithm');
        }
        cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [isPublic ? 'verify' : 'sign']);
      }
  }
  if (keyObject.asymmetricKeyType === 'rsa') {
    let hash;
    switch (alg) {
      case 'RSA-OAEP':
        hash = 'SHA-1';
        break;
      case 'RS256':
      case 'PS256':
      case 'RSA-OAEP-256':
        hash = 'SHA-256';
        break;
      case 'RS384':
      case 'PS384':
      case 'RSA-OAEP-384':
        hash = 'SHA-384';
        break;
      case 'RS512':
      case 'PS512':
      case 'RSA-OAEP-512':
        hash = 'SHA-512';
        break;
      default:
        throw new TypeError('given KeyObject instance cannot be used for this algorithm');
    }
    if (alg.startsWith('RSA-OAEP')) {
      return keyObject.toCryptoKey({
        name: 'RSA-OAEP',
        hash
      }, extractable, isPublic ? ['encrypt'] : ['decrypt']);
    }
    cryptoKey = keyObject.toCryptoKey({
      name: alg.startsWith('PS') ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5',
      hash
    }, extractable, [isPublic ? 'verify' : 'sign']);
  }
  if (keyObject.asymmetricKeyType === 'ec') {
    const nist = new Map([['prime256v1', 'P-256'], ['secp384r1', 'P-384'], ['secp521r1', 'P-521']]);
    const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
    if (!namedCurve) {
      throw new TypeError('given KeyObject instance cannot be used for this algorithm');
    }
    if (alg === 'ES256' && namedCurve === 'P-256') {
      cryptoKey = keyObject.toCryptoKey({
        name: 'ECDSA',
        namedCurve
      }, extractable, [isPublic ? 'verify' : 'sign']);
    }
    if (alg === 'ES384' && namedCurve === 'P-384') {
      cryptoKey = keyObject.toCryptoKey({
        name: 'ECDSA',
        namedCurve
      }, extractable, [isPublic ? 'verify' : 'sign']);
    }
    if (alg === 'ES512' && namedCurve === 'P-521') {
      cryptoKey = keyObject.toCryptoKey({
        name: 'ECDSA',
        namedCurve
      }, extractable, [isPublic ? 'verify' : 'sign']);
    }
    if (alg.startsWith('ECDH-ES')) {
      cryptoKey = keyObject.toCryptoKey({
        name: 'ECDH',
        namedCurve
      }, extractable, isPublic ? [] : ['deriveBits']);
    }
  }
  if (!cryptoKey) {
    throw new TypeError('given KeyObject instance cannot be used for this algorithm');
  }
  if (!cached) {
    cache.set(keyObject, {
      [alg]: cryptoKey
    });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
};
async function normalizeKey(key, alg) {
  if (key instanceof Uint8Array) {
    return key;
  }
  if (isCryptoKey(key)) {
    return key;
  }
  if (isKeyObject(key)) {
    if (key.type === 'secret') {
      return key.export();
    }
    if ('toCryptoKey' in key && typeof key.toCryptoKey === 'function') {
      try {
        return handleKeyObject(key, alg);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }
    let jwk = key.export({
      format: 'jwk'
    });
    return handleJWK(key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k);
    }
    return handleJWK(key, key, alg, true);
  }
  throw new Error('unreachable');
}

const tag = key => key?.[Symbol.toStringTag];
const jwkMatchesOp = (alg, key, usage) => {
  if (key.use !== undefined) {
    let expected;
    switch (usage) {
      case 'sign':
      case 'verify':
        expected = 'sig';
        break;
      case 'encrypt':
      case 'decrypt':
        expected = 'enc';
        break;
    }
    if (key.use !== expected) {
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
  }
  if (key.alg !== undefined && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  }
  if (Array.isArray(key.key_ops)) {
    let expectedKeyOp;
    switch (true) {
      case usage === 'sign':
      case alg === 'dir':
      case alg.includes('CBC-HS'):
        expectedKeyOp = usage;
        break;
      case alg.startsWith('PBES2'):
        expectedKeyOp = 'deriveBits';
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
        if (!alg.includes('GCM') && alg.endsWith('KW')) {
          expectedKeyOp = 'unwrapKey';
        } else {
          expectedKeyOp = usage;
        }
        break;
      case usage === 'encrypt':
        expectedKeyOp = 'wrapKey';
        break;
      case usage === 'decrypt':
        expectedKeyOp = alg.startsWith('RSA') ? 'unwrapKey' : 'deriveBits';
        break;
    }
    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
  }
  return true;
};
const symmetricTypeCheck = (alg, key, usage) => {
  if (key instanceof Uint8Array) return;
  if (isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage)) return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!isKeyLike(key)) {
    throw new TypeError(withAlg(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key', 'Uint8Array'));
  }
  if (key.type !== 'secret') {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
};
const asymmetricTypeCheck = (alg, key, usage) => {
  if (isJWK(key)) {
    switch (usage) {
      case 'decrypt':
      case 'sign':
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for this operation must be a private JWK`);
      case 'encrypt':
      case 'verify':
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for this operation must be a public JWK`);
    }
  }
  if (!isKeyLike(key)) {
    throw new TypeError(withAlg(alg, key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
  }
  if (key.type === 'secret') {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (key.type === 'public') {
    switch (usage) {
      case 'sign':
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
      case 'decrypt':
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
  }
  if (key.type === 'private') {
    switch (usage) {
      case 'verify':
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
      case 'encrypt':
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
  }
};
function checkKeyType(alg, key, usage) {
  switch (alg.substring(0, 2)) {
    case 'A1':
    case 'A2':
    case 'di':
    case 'HS':
    case 'PB':
      symmetricTypeCheck(alg, key, usage);
      break;
    default:
      asymmetricTypeCheck(alg, key, usage);
  }
}

function subtleAlgorithm(alg, algorithm) {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case 'HS256':
    case 'HS384':
    case 'HS512':
      return {
        hash,
        name: 'HMAC'
      };
    case 'PS256':
    case 'PS384':
    case 'PS512':
      return {
        hash,
        name: 'RSA-PSS',
        saltLength: parseInt(alg.slice(-3), 10) >> 3
      };
    case 'RS256':
    case 'RS384':
    case 'RS512':
      return {
        hash,
        name: 'RSASSA-PKCS1-v1_5'
      };
    case 'ES256':
    case 'ES384':
    case 'ES512':
      return {
        hash,
        name: 'ECDSA',
        namedCurve: algorithm.namedCurve
      };
    case 'Ed25519':
    case 'EdDSA':
      return {
        name: 'Ed25519'
      };
    case 'ML-DSA-44':
    case 'ML-DSA-65':
    case 'ML-DSA-87':
      return {
        name: alg
      };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}

async function getSigKey(alg, key, usage) {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith('HS')) {
      throw new TypeError(invalidKeyInput(key, 'CryptoKey', 'KeyObject', 'JSON Web Key'));
    }
    return crypto.subtle.importKey('raw', key, {
      hash: `SHA-${alg.slice(-3)}`,
      name: 'HMAC'
    }, false, [usage]);
  }
  checkSigCryptoKey(key, alg, usage);
  return key;
}

const epoch = date => Math.floor(date.getTime() / 1000);
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function secs(str) {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError('Invalid time period format');
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case 'sec':
    case 'secs':
    case 'second':
    case 'seconds':
    case 's':
      numericDate = Math.round(value);
      break;
    case 'minute':
    case 'minutes':
    case 'min':
    case 'mins':
    case 'm':
      numericDate = Math.round(value * minute);
      break;
    case 'hour':
    case 'hours':
    case 'hr':
    case 'hrs':
    case 'h':
      numericDate = Math.round(value * hour);
      break;
    case 'day':
    case 'days':
    case 'd':
      numericDate = Math.round(value * day);
      break;
    case 'week':
    case 'weeks':
    case 'w':
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === '-' || matched[4] === 'ago') {
    return -numericDate;
  }
  return numericDate;
}
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
class JWTClaimsBuilder {
  #payload;
  constructor(payload) {
    if (!isObject(payload)) {
      throw new TypeError('JWT Claims Set MUST be an object');
    }
    this.#payload = structuredClone(payload);
  }
  data() {
    return encoder.encode(JSON.stringify(this.#payload));
  }
  get iss() {
    return this.#payload.iss;
  }
  set iss(value) {
    this.#payload.iss = value;
  }
  get sub() {
    return this.#payload.sub;
  }
  set sub(value) {
    this.#payload.sub = value;
  }
  get aud() {
    return this.#payload.aud;
  }
  set aud(value) {
    this.#payload.aud = value;
  }
  set jti(value) {
    this.#payload.jti = value;
  }
  set nbf(value) {
    if (typeof value === 'number') {
      this.#payload.nbf = validateInput('setNotBefore', value);
    } else if (value instanceof Date) {
      this.#payload.nbf = validateInput('setNotBefore', epoch(value));
    } else {
      this.#payload.nbf = epoch(new Date()) + secs(value);
    }
  }
  set exp(value) {
    if (typeof value === 'number') {
      this.#payload.exp = validateInput('setExpirationTime', value);
    } else if (value instanceof Date) {
      this.#payload.exp = validateInput('setExpirationTime', epoch(value));
    } else {
      this.#payload.exp = epoch(new Date()) + secs(value);
    }
  }
  set iat(value) {
    if (value === undefined) {
      this.#payload.iat = epoch(new Date());
    } else if (value instanceof Date) {
      this.#payload.iat = validateInput('setIssuedAt', epoch(value));
    } else if (typeof value === 'string') {
      this.#payload.iat = validateInput('setIssuedAt', epoch(new Date()) + secs(value));
    } else {
      this.#payload.iat = validateInput('setIssuedAt', value);
    }
  }
}

async function sign(alg, key, data) {
  const cryptoKey = await getSigKey(alg, key, 'sign');
  checkKeyLength(alg, cryptoKey);
  const signature = await crypto.subtle.sign(subtleAlgorithm(alg, cryptoKey.algorithm), cryptoKey, data);
  return new Uint8Array(signature);
}

class FlattenedSign {
  #payload;
  #protectedHeader;
  #unprotectedHeader;
  constructor(payload) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError('payload must be an instance of Uint8Array');
    }
    this.#payload = payload;
  }
  setProtectedHeader(protectedHeader) {
    if (this.#protectedHeader) {
      throw new TypeError('setProtectedHeader can only be called once');
    }
    this.#protectedHeader = protectedHeader;
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    if (this.#unprotectedHeader) {
      throw new TypeError('setUnprotectedHeader can only be called once');
    }
    this.#unprotectedHeader = unprotectedHeader;
    return this;
  }
  async sign(key, options) {
    if (!this.#protectedHeader && !this.#unprotectedHeader) {
      throw new JWSInvalid('either setProtectedHeader or setUnprotectedHeader must be called before #sign()');
    }
    if (!isDisjoint(this.#protectedHeader, this.#unprotectedHeader)) {
      throw new JWSInvalid('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
    }
    const joseHeader = {
      ...this.#protectedHeader,
      ...this.#unprotectedHeader
    };
    const extensions = validateCrit(JWSInvalid, new Map([['b64', true]]), options?.crit, this.#protectedHeader, joseHeader);
    let b64 = true;
    if (extensions.has('b64')) {
      b64 = this.#protectedHeader.b64;
      if (typeof b64 !== 'boolean') {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const {
      alg
    } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    checkKeyType(alg, key, 'sign');
    let payloadS;
    let payloadB;
    if (b64) {
      payloadS = encode(this.#payload);
      payloadB = encode$1(payloadS);
    } else {
      payloadB = this.#payload;
      payloadS = '';
    }
    let protectedHeaderString;
    let protectedHeaderBytes;
    if (this.#protectedHeader) {
      protectedHeaderString = encode(JSON.stringify(this.#protectedHeader));
      protectedHeaderBytes = encode$1(protectedHeaderString);
    } else {
      protectedHeaderString = '';
      protectedHeaderBytes = new Uint8Array();
    }
    const data = concat(protectedHeaderBytes, encode$1('.'), payloadB);
    const k = await normalizeKey(key, alg);
    const signature = await sign(alg, k, data);
    const jws = {
      signature: encode(signature),
      payload: payloadS
    };
    if (this.#unprotectedHeader) {
      jws.header = this.#unprotectedHeader;
    }
    if (this.#protectedHeader) {
      jws.protected = protectedHeaderString;
    }
    return jws;
  }
}

class CompactSign {
  #flattened;
  constructor(payload) {
    this.#flattened = new FlattenedSign(payload);
  }
  setProtectedHeader(protectedHeader) {
    this.#flattened.setProtectedHeader(protectedHeader);
    return this;
  }
  async sign(key, options) {
    const jws = await this.#flattened.sign(key, options);
    if (jws.payload === undefined) {
      throw new TypeError('use the flattened module for creating JWS with b64: false');
    }
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }
}

class SignJWT {
  #protectedHeader;
  #jwt;
  constructor(payload = {}) {
    this.#jwt = new JWTClaimsBuilder(payload);
  }
  setIssuer(issuer) {
    this.#jwt.iss = issuer;
    return this;
  }
  setSubject(subject) {
    this.#jwt.sub = subject;
    return this;
  }
  setAudience(audience) {
    this.#jwt.aud = audience;
    return this;
  }
  setJti(jwtId) {
    this.#jwt.jti = jwtId;
    return this;
  }
  setNotBefore(input) {
    this.#jwt.nbf = input;
    return this;
  }
  setExpirationTime(input) {
    this.#jwt.exp = input;
    return this;
  }
  setIssuedAt(input) {
    this.#jwt.iat = input;
    return this;
  }
  setProtectedHeader(protectedHeader) {
    this.#protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    const sig = new CompactSign(this.#jwt.data());
    sig.setProtectedHeader(this.#protectedHeader);
    if (Array.isArray(this.#protectedHeader?.crit) && this.#protectedHeader.crit.includes('b64') && this.#protectedHeader.b64 === false) {
      throw new JWTInvalid('JWTs MUST NOT use unencoded payload');
    }
    return sig.sign(key, options);
  }
}

async function getGoogleToken(email, privateKey) {
  // Google expects RS256-signed JWT with specific claims :contentReference[oaicite:2]{index=2}
  const now = Math.floor(Date.now() / 1000);

  // const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // handle escaped newlines
  const alg = 'RS256';
  const key = await importPKCS8(privateKey, alg);
  const jwt = await new SignJWT({
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  }).setProtectedHeader({
    alg
  }).setIssuer(email).setSubject(email).setAudience('https://oauth2.googleapis.com/token').setIssuedAt(now).setExpirationTime(now + 3600).sign(key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token request failed: ${res.status} ${txt}`);
  }
  const json = await res.json();
  return json.access_token;
}

const cacheMap = new Map();
async function getTokenMemo(email, private_key) {
  const cached = cacheMap.get(email);
  if (cached && cached.expiration > Date.now()) {
    return cached.token;
  }
  const newToken = await getGoogleToken(email, private_key);
  cacheMap.set(email, {
    token: newToken,
    expiration: Date.now() + 1000 * 60 * 5
  });
  return newToken;
}

typeof process !== "undefined" && !!(process.versions && process.versions.node);
typeof Utilities !== "undefined" && typeof Utilities.base64Encode === "function";
const TOURNAMENTS_COLUMN = "E";
const TOKEN_CELL = "G2";
const TOKEN_CELL_ADMIN = "H2";
const ADMIN_SHEET = "Admin";
const MATCH_SHEET = "Matches";
const MATCH_A_WINS_CELL = "F";
const MATCH_B_WINS_CELL = "G";
const ROSTER_SHEET = "Roster";

async function getTokensCf(api) {
  const data = await api.readRange(`${ADMIN_SHEET}!${TOKEN_CELL}:${TOKEN_CELL_ADMIN}`);
  return {
    token: data[0][0],
    adminToken: data[0][1]
  };
}

async function hmacSha256Base64(key, str) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function cleanValue(str) {
  return str === "" || str === undefined ? undefined : str.toString();
}

function cleanNumber(str) {
  return str === "" || str === undefined ? undefined : Number(str);
}

function rawToMatches(raw) {
  const rows = [];
  for (const [i, val] of Object.entries(raw)) {
    const pool = cleanValue(val[0]);
    const idA = cleanValue(val[1]);
    const idB = cleanValue(val[3]);
    const aWins = cleanNumber(val[5]);
    const bWins = cleanNumber(val[6]);
    if (pool === undefined || idA === undefined || idB === undefined) {
      continue;
    }
    const completed = aWins !== undefined && bWins !== undefined;
    let winner;
    let loser;
    if (completed) {
      winner = aWins > bWins ? idA : idB;
      loser = winner === idA ? idB : idA;
    }
    rows.push({
      row: Number(i) + 2,
      pool,
      idA,
      idB,
      aWins,
      bWins,
      completed,
      winner,
      loser
    });
  }
  return rows;
}

async function getMatchRowsCf(api, tournament) {
  const raw = await api.readRange(`${MATCH_SHEET}_${tournament}!A2:G`);
  const matchRows = rawToMatches(raw);
  return matchRows;
}

async function getMatchesCf(api, data) {
  if (data.tournament === undefined) {
    throw new Error("Must specify tournament");
  }
  return getMatchRowsCf(api, data.tournament);
}

function cleanBoolean(str) {
  return str === "" || str === undefined ? false : Boolean(str);
}

function rawToRoster(raw) {
  const roster = [];
  for (const [i, val] of Object.entries(raw)) {
    const id = cleanValue(val[0]);
    const name = cleanValue(val[1]);
    const rating = cleanNumber(val[2]);
    const pool = cleanValue(val[3]);
    const newRating = cleanNumber(val[4]);
    const delta = cleanNumber(val[5]);
    const playing = cleanBoolean(val[6]);
    if (id === undefined || name === undefined || rating === undefined) {
      continue;
    }
    roster.push({
      row: Number(i) + 2,
      id,
      name,
      rating,
      pool,
      newRating,
      delta,
      playing
    });
  }
  return roster;
}

async function getRosterRowsCf(api, tournament) {
  const raw = await api.readRange(`${ROSTER_SHEET}_${tournament}!A2:G`);
  return rawToRoster(raw);
}

async function getRosterCf(api, data) {
  if (data.tournament === undefined) {
    throw new Error("Must specify tournament");
  }
  return getRosterRowsCf(api, data.tournament);
}

async function getTournamentsCf(api) {
  const data = await api.readRange(`${ADMIN_SHEET}!${TOURNAMENTS_COLUMN}2:${TOURNAMENTS_COLUMN}`);
  return data.flat().filter(val => val !== "");
}

async function updateMatchCf(api, data) {
  if (data.tournament === undefined) {
    throw new Error("Must specify tournament");
  }
  await api.updateRange(`${MATCH_SHEET}_${data.tournament}!${MATCH_A_WINS_CELL}${data.row}`, [[data.aWins.toString()]]);
  await api.updateRange(`${MATCH_SHEET}_${data.tournament}!${MATCH_B_WINS_CELL}${data.row}`, [[data.bWins.toString()]]);
  return {
    success: true
  };
}

const apiBase = `https://sheets.googleapis.com/v4/spreadsheets`;
class SheetsApi {
  #sheet;
  #token;
  constructor({
    token,
    sheet
  }) {
    this.#token = token;
    this.#sheet = sheet;
  }
  async readRange(range) {
    const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    });
    const data = await res.json();
    return data.values || [];
  }
  async updateRange(range, values) {
    const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    const body = {
      values
    };
    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.#token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }
  async clearRange(range) {
    const url = `${apiBase}/${this.#sheet}/values/${encodeURIComponent(range)}:clear`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.#token}`,
        "Content-Type": "application/json"
      }
    });
  }
}

const methods = {
  getMatches: getMatchesCf,
  getRoster: getRosterCf,
  getTournaments: getTournamentsCf,
  updateMatch: updateMatchCf
};
async function handleApi(request, env, ctx) {
  if (request.method !== "POST") {
    return {
      success: false,
      message: "Method not allowed."
    };
  }
  const {
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    SHEET_ID
  } = env;
  const googleToken = await getTokenMemo(GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY);
  const sheetsApi = new SheetsApi({
    token: googleToken,
    sheet: SHEET_ID
  });
  const data = await request.json();
  if (!data.method) {
    throw new Error("Must pass JSON data and declare a method");
  }
  const method = methods[data.method];
  if (!method) {
    throw new Error(`Invalid method '${data.method}', must be one of ${Object.keys(methods).join(", ")}.`);
  }
  const packet = {
    method: data.method,
    data: data.data
  };
  const {
    token,
    adminToken
  } = await getTokensCf(sheetsApi);
  if (data.method !== "checkToken") {
    const jsonString = JSON.stringify(packet);
    const primarySig = await hmacSha256Base64(token, jsonString);
    const adminSig = await hmacSha256Base64(adminToken, jsonString);
    if (primarySig !== data.signature && adminSig !== data.signature) {
      throw new Error(`Invalid authentication, user not authorized.`);
    }
  }
  const result = method(sheetsApi, data.data);
  return result;
}

var cfWorker = {
  async fetch(request, env, ctx) {
    const {
      pathname
    } = new URL(request.url);
    if (pathname === "/api_v2/") {
      let result;
      let status = 200;
      try {
        result = await handleApi(request, env, ctx);
      } catch (e) {
        status = 500;
        result = {
          error: e.message
        };
      }
      const resp = new Response(JSON.stringify(result), {
        status
      });
      resp.headers.set("Access-Control-Allow-Origin", "*");
      resp.headers.set("Access-Control-Allow-Methods", "*");
      resp.headers.set("Access-Control-Allow-Headers", "*");
      return resp;
    }
    const GAS_URL = env.SHEET;
    const body = request.method === "POST" ? await request.arrayBuffer() : undefined;
    if (!body) {
      return new Response("Must pass POST body");
    }
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: body,
      redirect: "follow"
    });
    const text = await response.text();
    const cfResponse = new Response(text, response);
    cfResponse.headers.set("Access-Control-Allow-Origin", "*");
    cfResponse.headers.set("Access-Control-Allow-Methods", "*");
    cfResponse.headers.set("Access-Control-Allow-Headers", "*");
    return cfResponse;
  }
};

export { cfWorker as default };

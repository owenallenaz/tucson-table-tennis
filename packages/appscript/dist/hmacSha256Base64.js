import { isNode } from "./constants.js";
export default function hmacSha256Base64(secret, data) {
    return isNode ? hmacSha256Base64Node(secret, data) : hmacSha256Base64AS(secret, data);
}
function hmacSha256Base64Node(secret, data) {
    const crypto = require("crypto");
    return crypto.createHmac("sha256", secret).update(data, "utf8").digest("base64");
}
function hmacSha256Base64AS(secret, data) {
    const sig = Utilities.computeHmacSha256Signature(data, secret);
    return Utilities.base64Encode(sig);
}

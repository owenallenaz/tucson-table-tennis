import cleanValue from "./cleanValue.js";

interface Player {
	id: string
	name: string
	rating: string,
	pool: string
}

export default function rawToRoster(raw: string[][]) {
	return raw.map(val => {
		return {
			id: cleanValue(val[0]),
			name: cleanValue(val[1]),
			rating: cleanValue(val[2]),
			pool: cleanValue(val[3])
		}
	});
}

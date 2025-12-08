export default function cleanValue(str: string | undefined) {
	return str === "" || str === undefined ? undefined : str.toString();
}

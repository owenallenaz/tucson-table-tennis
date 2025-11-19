export default function cleanValue(str: string) {
	return str === "" ? undefined : str.toString();
}

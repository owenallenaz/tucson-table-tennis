export default function cleanNumber(str: string): number | undefined {
	return str === "" ? undefined : Number(str);
}

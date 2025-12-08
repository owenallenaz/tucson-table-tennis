export default function cleanNumber(str: string | undefined): number | undefined {
	return str === "" || str === undefined ? undefined : Number(str);
}

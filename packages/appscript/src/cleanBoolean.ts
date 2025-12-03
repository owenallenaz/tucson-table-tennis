export default function cleanBoolean(str: string): boolean {
    return str === "" ? false : Boolean(str);
}

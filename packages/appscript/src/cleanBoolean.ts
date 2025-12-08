export default function cleanBoolean(str: string | undefined): boolean {
    return str === "" || str === undefined ? false : Boolean(str);
}

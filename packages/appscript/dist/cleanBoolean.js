export default function cleanBoolean(str) {
    return str === "" ? false : Boolean(str);
}

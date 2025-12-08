export default function cleanBoolean(str) {
    return str === "" || str === undefined ? false : Boolean(str);
}

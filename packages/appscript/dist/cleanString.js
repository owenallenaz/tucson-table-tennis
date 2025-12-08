export default function cleanValue(str) {
    return str === "" || str === undefined ? undefined : str.toString();
}

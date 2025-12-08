export default function cleanNumber(str) {
    return str === "" || str === undefined ? undefined : Number(str);
}

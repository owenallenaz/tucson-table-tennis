import getToken from "../getToken.js";

export default function checkToken(e, data) {
	const token = getToken();

	return { success: token === data.token };
}

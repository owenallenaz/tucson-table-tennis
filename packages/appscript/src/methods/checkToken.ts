import getTokens from "../getTokens.js";

export default function checkToken(e, data) {
	const { token, adminToken } = getTokens();
	const type = data.token === token
		? "primary"
		: data.token === adminToken
			? "admin"
		: undefined
	;

	return {
		success: type !== undefined,
		type
	};
}

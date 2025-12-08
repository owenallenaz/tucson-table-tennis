import handleApi from "./handleApi.js";

export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);
		if (pathname === "/api_v2/") {
			let result;
			let status = 200;
			try {
				result = await handleApi(request, env, ctx);
			} catch (e: any) {
				status = 500;
				result = { error: e.message }
			}

			const resp = new Response(JSON.stringify(result), { status });
			resp.headers.set("Access-Control-Allow-Origin", "*");
			resp.headers.set("Access-Control-Allow-Methods", "*");
			resp.headers.set("Access-Control-Allow-Headers", "*");
			return resp;
		}

		const GAS_URL = env.SHEET;

		const body = request.method === "POST" ? await request.arrayBuffer() : undefined;

		if (!body) {
			return new Response("Must pass POST body");
		}

		const response = await fetch(GAS_URL, {
			method: "POST",
			body: body,
			redirect: "follow"
		});

		const text = await response.text();

		const cfResponse = new Response(text, response);
		cfResponse.headers.set("Access-Control-Allow-Origin", "*");
		cfResponse.headers.set("Access-Control-Allow-Methods", "*");
		cfResponse.headers.set("Access-Control-Allow-Headers", "*");

		return cfResponse;
	}
}

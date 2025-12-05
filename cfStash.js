import test from "./test.js";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
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
};

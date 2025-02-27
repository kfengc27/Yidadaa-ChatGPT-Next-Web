import { NextRequest } from "next/server";

const OPENAI_URL = "api.openai-sb.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  // console.log(req.headers.get("token"));
  console.log("测试");
  // const apiKey = "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";
  const openaiPath = req.headers.get("path");

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  console.log("[Proxy] ", openaiPath);
  console.log("[Base Url]", baseUrl);

  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: req.method,
    body: req.body,
  });
}

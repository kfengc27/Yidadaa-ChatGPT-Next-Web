import fetch from "node-fetch";
import fs from "fs/promises";

const RAW_FILE_URL = "https://raw.githubusercontent.com/";
const MIRRORF_FILE_URL = "https://raw.fgit.ml/";

const RAW_CN_URL = "PlexPt/awesome-chatgpt-prompts-zh/main/prompts-zh.json";
const CN_URL = MIRRORF_FILE_URL + RAW_CN_URL;
const RAW_EN_URL = "f/awesome-chatgpt-prompts/main/prompts.csv";
const EN_URL = MIRRORF_FILE_URL + RAW_EN_URL;
const FILE = "./public/prompts.json";

async function fetchCN() {
  console.log("[Fetch] fetching cn prompts...");
  try {
    const raw = await (await fetch(CN_URL)).json();
    return raw.map((v) => [v.act, v.prompt]);
  } catch (error) {
    console.error("[Fetch] failed to fetch cn prompts", error);
    return [];
  }
}

async function fetchEN() {
  console.log("[Fetch] fetching en prompts...");
  try {
    const raw = await (await fetch(EN_URL)).text();
    return raw
      .split("\n")
      .slice(1)
      .map((v) => v.split('","').map((v) => v.replace('"', "")));
  } catch (error) {
    console.error("[Fetch] failed to fetch cn prompts", error);
    return [];
  }
}

// async function main() {
//   Promise.all([fetchCN(), fetchEN()])
//     .then(([cn, en]) => {
//       fs.writeFile(FILE, JSON.stringify({ cn, en }));
//     })
//     .catch((e) => {
//       console.error("[Fetch] failed to fetch prompts");
//       fs.writeFile(FILE, JSON.stringify({ cn: [], en: [] }));
//     })
//     .finally(() => {
//       console.log("[Fetch] saved to " + FILE);
//     });
// }

// main();

async function main() {
  let existingData = { cn: [], en: [] };

  try {
    // Try to read existing data if the file exists
    const fileContent = await fs.readFile(FILE, "utf8");
    existingData = JSON.parse(fileContent);
  } catch (error) {
    console.warn("[Fetch] No existing prompts.json found. Creating a new one...");
  }

  Promise.all([fetchCN(), fetchEN()])
    .then(([cn, en]) => {
      const newData = {
        cn: cn.length ? cn : existingData.cn, // Keep old CN data if fetch fails
        en: en.length ? en : existingData.en, // Keep old EN data if fetch fails
      };

      fs.writeFile(FILE, JSON.stringify(newData, null, 2));
      console.log("[Fetch] Successfully updated prompts.json");
    })
    .catch((e) => {
      console.error("[Fetch] Failed to fetch prompts, keeping old data", e);
    });
}

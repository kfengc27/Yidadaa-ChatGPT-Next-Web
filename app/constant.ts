export const OWNER = "Yidadaa";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";
export const SUMMARIZE_MODEL = "gpt-4o";
export const DEFAULT_SYSTEM_PROMPT =
  "You are an SDG AI assistant helping users achieve their sustainable development goals.";

export const INITIAL_PROMPT_TEMPLATES = [
  {
    title: "Promote Quality Education",
    content:
      "Suggest three ideas of SDG initiative for promoting quality education.",
  },
  {
    title: "Improve SDG Action Plans",
    content:
      "Can you provide suggestions for how I can improve my SDG action plans?",
  },
  {
    title: "Evaluate SDG Feasibility",
    content: "Evaluate the feasibility of my SDG action plans?",
  },
];

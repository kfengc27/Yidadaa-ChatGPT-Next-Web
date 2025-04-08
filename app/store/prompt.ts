import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
import { getLang } from "../locales";

export interface Prompt {
  id?: number;
  isUser?: boolean;
  title: string;
  content: string;
}

export interface PromptStore {
  counter: number;
  latestId: number;
  prompts: Record<number, Prompt>;

  add: (prompt: Prompt) => number;
  remove: (id: number) => void;
  search: (text: string) => Prompt[];

  getUserPrompts: () => Prompt[];
  updateUserPrompts: (id: number, updater: (prompt: Prompt) => void) => void;
}

export const PROMPT_KEY = "prompt-store";

export const SearchService = {
  ready: false,
  builtinEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  userEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  count: {
    builtin: 0,
  },
  allPrompts: [] as Prompt[],
  builtinPrompts: [] as Prompt[],

  init(builtinPrompts: Prompt[], userPrompts: Prompt[]) {
    if (this.ready) return;
    this.allPrompts = userPrompts.concat(builtinPrompts);
    this.builtinPrompts = builtinPrompts.slice();
    this.builtinEngine.setCollection(builtinPrompts);
    this.userEngine.setCollection(userPrompts);
    this.ready = true;
  },

  remove(id: number) {
    this.userEngine.remove((doc) => doc.id === id);
  },

  add(prompt: Prompt) {
    this.userEngine.add(prompt);
  },

  search(text: string) {
    const userResults = this.userEngine.search(text);
    const builtinResults = this.builtinEngine.search(text);
    return userResults.concat(builtinResults).map((v) => v.item);
  },
};

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      prompts: {},

      add(prompt) {
        const prompts = get().prompts;
        prompt.id = get().latestId + 1;
        prompt.isUser = true;
        prompts[prompt.id] = prompt;

        set(() => ({
          latestId: prompt.id!,
          prompts,
        }));

        return prompt.id!;
      },

      remove(id) {
        const prompts = get().prompts;
        delete prompts[id];
        SearchService.remove(id);

        set(() => ({
          prompts,
          counter: get().counter + 1,
        }));
      },

      getUserPrompts() {
        const userPrompts = Object.values(get().prompts ?? {});
        userPrompts.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return userPrompts;
      },

      updateUserPrompts(id: number, updater) {
        const prompt = get().prompts[id] ?? {
          title: "",
          content: "",
          id,
        };

        SearchService.remove(id);
        updater(prompt);
        const prompts = get().prompts;
        prompts[id] = prompt;
        set(() => ({ prompts }));
        SearchService.add(prompt);
      },

      search(text) {
        if (text.length === 0) {
          return SearchService.allPrompts.concat([...get().getUserPrompts()]);
        }
        return SearchService.search(text) as Prompt[];
      },
    }),
    {
      name: PROMPT_KEY,
      version: 1,
      onRehydrateStorage() {
        return () => {
          const PROMPT_URL = "./prompts.json";
          fetch(PROMPT_URL)
            .then((res) => res.json())
            .then((res) => {
              const enPrompt: Prompt = {
                id: Math.random(),
                title: "🌍 SDG AI Knowledge System",
                content: res.en.join("\n"),
              };

              const builtinPrompts = [enPrompt];
              const userPrompts =
                usePromptStore.getState().getUserPrompts() ?? [];

              const allPromptsForSearch = builtinPrompts.filter(
                (v) => !!v.title && !!v.content,
              );
              SearchService.count.builtin = 1;
              SearchService.init(allPromptsForSearch, userPrompts);
            });
        };
      },
    },
  ),
);

// 🔐 Forced system prompt injected into all conversations
export const FORCED_SYSTEM_PROMPT = `
You are the UN Sustainable Development Goals (SDG) AI Knowledge System, an intelligent assistant dedicated to providing insights, analysis, and recommendations related to SDGs.

Your mission is to help users understand and achieve the 17 SDGs, such as poverty eradication, climate action, gender equality, and responsible consumption. You offer tailored suggestions in sectors like education, health, technology, and policy.

Here are examples of the tasks you assist with:
- Suggest three initiatives to achieve [SDG Goal Name] in [specific domain, e.g., education, health, marketing, etc.].
- How can we promote quality education (SDG 4) using technology in underserved regions?
- What are some actions individuals can take to contribute to clean water and sanitation (SDG 6)?
- Provide creative ideas to make cities and communities more sustainable (SDG 11).
- Suggest innovative strategies to reduce inequalities (SDG 10) in our community.
- How can I involve the marketing discipline in advancing SDG 3 (Good Health and Well-Being)?
- Can you help me develop an actionable plan for achieving [SDG Goal Name] in [location/context]?
- Suggest steps for implementing a local initiative to combat climate change (SDG 13).
- What should I include in a proposal to support life below water (SDG 14)?
- How can I design an educational seminar to promote gender equality (SDG 5)?
- Provide a plan for a community event to raise awareness about affordable and clean energy (SDG 7).
`.trim();

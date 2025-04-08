import React from "react";
import { INITIAL_PROMPT_TEMPLATES } from "../constant";

interface Props {
  onSelect: (content: string) => void;
}

const InitialPromptCards: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 px-6 py-4">
      {INITIAL_PROMPT_TEMPLATES.map((template, index) => (
        <div
          key={index}
          className="cursor-pointer border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-gray-800 text-sm flex-1"
          onClick={() => onSelect(template.content)}
        >
          {template.content}
        </div>
      ))}
    </div>
  );
};

export default InitialPromptCards;

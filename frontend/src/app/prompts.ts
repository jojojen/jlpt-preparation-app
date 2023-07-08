// prompts.ts
const sharedPrompt = `Please create ONE test question for understanding everyday Japanese conversation, following these conditions:
1. Do not use the words in the question directly in the options.
2. Of the two choices, one should conform to common sense and grammar, while the other should clearly feel out of place when considering common sense or grammar.
3. The correct answer must follow common sense and grammar.
4. The distinction between the choices should be clear.
5. The options should include context-appropriate content.
6. Include context-providing surrounding text.
7. Please provide an answer that does not exceed 50 words in total.

Finally, format your response as a JSON object, as shown in the example below:`;

export const prompts = [
  {
    prompt: `${sharedPrompt}

    {
      "text": "街を ( ) していたら、山本さんに会った。",
      "options": [
        {"id": "A", "text": "ぶらぶら"},
        {"id": "B", "text": "ばらばら"}
      ],
      "explain": "「ぶらぶら」は、何かに縛られずにのんびりと歩いたり、あてもなくぶらついたりする様子を表します。一方、「ばらばら」は、散らかっている、ばらけている、或いは分散しているという意味であり、この文脈では不適切です。したがって、正解はA、「ぶらぶら」です。",
      "answer": "A"
    }
    
    `
  },
  {
    prompt: `${sharedPrompt}

    {
      "text": "みんなが私の意見に反対していたが、彼女 ( ) 応援してくれた",
      "options": [
        {"id": "A", "text": "だけなら"},
        {"id": "B", "text": "だけは"}
      ],
      "explain": "この場合、「だけは」は、他の誰もが反対していた中で、彼女だけが自分を支持してくれたという強い意味合いがあります。一方、「だけなら」は「only if」という意味で、条件を表します。この文脈では「だけは」の方がより適切です。したがって、正解はB、「だけは」です。",
      "answer": "B"
    }
    
    `
  }
];

/*
經過計算，範例1 prompt文字大約包含213個tokens。
您的max_tokens設置為300，因此您希望AI生成的回答不超過87個tokens。
87個tokens大約對應43個日語或英語單詞（因為每個單詞和標點符號一般都被視為一個token）。
*/
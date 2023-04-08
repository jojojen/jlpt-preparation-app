import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiKey: string = environment.openaiApiKey;
  private prompt = `「VOCALOID」の歌詞から、日常会話で使われる日本語を理解するための問題を作成してください。条件は以下の通りです。:
  1. 問題文の単語を選択肢にそのまま使わない。
  2. 2つの選択肢のうち1つは常識・文法に合致し、もう1つは常識・文法に照らして明確に違和感のあるものとする。
  3. 正解は常識・文法に従っていること。
  4. 選択肢の区別が明確であること。
  5. 選択肢は文脈に適したものを含める。
  6. 文脈を提供する上下文を含める。
  7. Must return a valid JSON:

    例：
    
  {
    "text": "「出発する日、 ___ にたくさんの友達が来てくれた」",
    "options": [
      {"id": "A", "text": "見聞き"},
      {"id": "B", "text": "見送り"}
    ],
    "answer": "B",
    "expalain": "選択肢A(見聞きする、みききする)は、「見る」と「聞く」の意味で、この状況では明らかに適切ではありません。選択肢B(見送りする、みおくりする)は、「見送る」という意味で、この状況では正しい選択肢です。"
  }`;

  constructor() {}

  async callGpt3Api(): Promise<{resultText: string, error: string}> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: this.prompt,
          max_tokens: 300,
          n: 1,
          stop: null,
          temperature: 0.6,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
  
      if (response.data.choices && response.data.choices.length > 0) {
        const choice = response.data.choices[0];
        console.log('GPT-3 response text:', choice.text);
        let parsedText;
        try {
          parsedText = JSON.parse(choice.text);
          return { resultText: JSON.stringify(parsedText), error: '' };
        } catch (error) {
          console.error('Error fetching GPT-3 response:', error);
          return { resultText: '', error: (error as Error).message };
        }
      }
    } catch (error) {
      console.error('Error fetching GPT-3 response:', error);
    }
    return { resultText: '', error: '' };
  }
}

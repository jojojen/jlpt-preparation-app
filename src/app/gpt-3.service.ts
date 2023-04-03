import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiKey: string = environment.openaiApiKey;
  private prompt = `日常会話で使われる日本語を理解するための問題を作成してください。条件は以下の通りです。:
  1. 日常生活の日本語を使用する。
  2. 問題文の単語を選択肢にそのまま使わない。
  3. 2つの選択肢のうち1つは常識・文法に合致し、もう1つは合わないものとする。
  4. 正解は常識・文法に従っていること。
  6. 選択肢の区別が明確であること。
  7. 選択肢は文脈に適したものを含める。
  8. output format including brackets, double quotation marks, colons must be the same as eaxmple below:
  {
    "text": "「出発する日、 ___ にたくさんの友達が来てくれた",
    "options": [
      { "id": "A", "text": "見聞き" },
      { "id": "B", "text": "見送り" }
    ],
    "answer": "B"
  }`;

  constructor() {}

  async callGpt3Api(): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: this.prompt,
          max_tokens: 300,
          n: 1,
          stop: null,
          temperature: 0.5,
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
        } catch (error) {
          throw new Error('GPT-3 response is not valid JSON');
        }
  
        return parsedText ? JSON.stringify(parsedText) : '';
      }
    } catch (error) {
      console.error('Error fetching GPT-3 response:', error);
    }
  
    return '';
  }
  
}

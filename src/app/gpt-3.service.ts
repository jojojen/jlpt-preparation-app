import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiKey: string = environment.openaiApiKey;
  private prompt = `日常会話で使用される日本語を大まかに理解できるかどうかを評価する問題を作成してください。
  問題文と選択肢は以下の条件に合わせる必要があります:
  1. 日常生活で使用される日本語または新聞の見出しで使用される日本語。
  2. 問題文と選択肢に重複する単語を避けてください。
  3. 生成される2つの選択肢は、1つは常識や文法に合致し、もう一つの選択肢は、常識や文法に反していなければなりません。
  4. 解答として選ばれる選択肢は、常識に適合し、文法にも従っている必要があります。
  5. 誤った選択肢は常識や文法に合致しないものにしてください。
  6. 生成される問題は、正しい選択肢と誤った選択肢の区別が明確でなければならない。
  7. output format including brackets, double quotation marks, colons must be the same as eaxmple below:
  {
    "text": "「昨日、友達と_____を見ました。」この空欄に最も適切な言葉は何ですか?",
    "options": [
      { "id": "A", "text": "トマト" },
      { "id": "B", "text": "映画" }
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

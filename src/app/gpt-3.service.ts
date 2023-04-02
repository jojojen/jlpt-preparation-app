import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../environments/environment.openai';

@Injectable({
  providedIn: 'root'
})
export class Gpt3Service {
  private apiKey: string = environment.openaiApiKey;
  private prompt = `JLPT N3の語彙を使って自然でわかりやすい選択肢付きの日常会話の問題を作成してください。ただし、問題には選択肢の答えを含めないでください。生成される2つの選択肢は、1つは常識や文法に合致し、もう1つは常識や文法に合致しないものにしてください。 
  punctuations format must be the same as eaxmple below:
  {
    "text": "後輩「おかわりを注文しましょうか。」 先輩「いや、もう間に合っているよ。」 間に合っている＝？",
    "options": [
      { "id": "A", "text": "時間通りに来る" },
      { "id": "B", "text": "十分である" }
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

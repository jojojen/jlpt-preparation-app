import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonExtractorService {
  constructor() { }

  extractJson(text: string): any {

    const jsonRegex = /({[\s\S]*})/;
    const jsonMatch = text.match(jsonRegex);
    
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[0];
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    } else {
      return null;
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  removeClassFromElementById(elementId: string, className: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove(className);
    }
  }
}

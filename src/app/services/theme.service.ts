import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  activeTheme: string = 'dark';
  
  constructor() { }

  getTheme() {
    return this.activeTheme;
  }

  setTheme(theme: string) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink) {
      themeLink.href = theme + '.css';
    }
    this.activeTheme = theme;
  }
}

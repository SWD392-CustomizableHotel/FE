import { Component } from '@angular/core';
import { LayoutService } from '../services/app.layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) { }
}

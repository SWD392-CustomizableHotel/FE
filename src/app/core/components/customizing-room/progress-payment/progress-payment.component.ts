import { Component, Input } from '@angular/core';
import { CustomizeRequest } from '../../../../interfaces/models/customize-request';

@Component({
  selector: 'app-progress-payment',
  templateUrl: './progress-payment.component.html',
  styleUrl: './progress-payment.component.scss'
})
export class ProgressPaymentComponent {
  @Input() isHideCustomizing: boolean = false;
  @Input() customizeRequest!: (type: CustomizeRequest) => CustomizeRequest;
}

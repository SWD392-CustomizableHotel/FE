import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { SendInvoiceService } from '../../../services/send-invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.scss'
})
export class ConfirmPaymentComponent implements OnInit {
  stripe: any;

  constructor(private sendMailService: SendInvoiceService,
    public router: Router ) {

  }

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe('pk_test_51PVP1yP7srpKRMQLK0pKqvXlaDT2Gm9spkU73T9nH43Lq5crcwI1rp0dNOn7VLA6FDKql8BxFn546RdqITdz1RSm00J8e6HLMI');
    this.checkStatus();
  }

  async checkStatus() : Promise<void> {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);
      switch (paymentIntent.status) {
        case 'succeeded':
          this.showMessage('Payment succeed');
          break;
        case 'processing':
          this.showMessage('Payment processing');
          break;
        case 'requires_payment_method':
          this.showMessage('Payment failed');
          break;
        case 'canceled':
          this.showMessage('Payment Canceled');
          break;
        default:
          this.showMessage('Something went wrong');
          break;
      }
  }

  // UI Helpers
  showMessage(messageText : string) : void {
    const messageContainer = document.querySelector('#payment-message');
    if (messageContainer !== null) {
      messageContainer.classList.remove('hidden');
      messageContainer.textContent = messageText;
    }
  }
}

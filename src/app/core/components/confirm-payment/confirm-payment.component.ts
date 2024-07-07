import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { SendInvoiceService } from '../../../services/send-invoice.service';
import { BookingService } from '../../../services/booking.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { environment } from '../../../../assets/environments/environment';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.scss',
})
export class ConfirmPaymentComponent implements OnInit {
  stripe: any;
  invoiceDownloadLink?: string;
  invoiceHostedPages?: string;
  bookingCode?: string;
  paymentCode?: string;
  selectedRoomId?: number;
  selectedUserId?: string;
  rangDates?: Date[];
  bookingId?: number;
  totalPrice?: number;
  constructor(
    private sendMailService: SendInvoiceService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    public router: Router
  ) {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY);
    this.checkStatus();
  }

  async checkStatus(): Promise<void> {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) {
      return;
    }

    const paymentIntentId = new URLSearchParams(window.location.search).get(
      'payment_intent'
    );

    this.bookingCode = 'B_' + paymentIntentId;
    this.paymentCode = 'P_' + paymentIntentId;

    const { paymentIntent } = await this.stripe.retrievePaymentIntent(
      clientSecret
    );
    switch (paymentIntent.status) {
      case 'succeeded':
        if (!paymentIntentId) {
          return;
        }
        this.showMessage(
          'Your payment for the reservation has been successfully completed. Thank you!'
        );
        this.bookingService.createBooking(this.bookingCode).subscribe({
          next: (response: any) => {
            this.bookingId = response.data;
            this.totalPrice = paymentIntent.amount / 100;
            this.paymentService
              .createPayment(
                this.paymentCode,
                this.totalPrice,
                paymentIntentId,
                this.bookingId
              )
              .subscribe({
                next: (response1: any) => {
                  console.log(response1);
                  this.paymentService.updateRoomStatusAfterBooking().subscribe({
                    next: (response2: any) => {
                      console.log(response2);
                      const invoiceLink =
                        document.getElementById('invoiceLink');
                      invoiceLink?.classList.remove('hidden');
                      const invoicePage =
                        document.getElementById('invoicePage');
                      invoicePage?.classList.remove('hidden');
                    },
                  });
                },
              });
          },
        });
        this.sendMailService.getInvoiceLink(paymentIntentId).subscribe({
          next: (response: any) => {
            this.invoiceDownloadLink = response[0];
            this.invoiceHostedPages = response[1];
          },
          error: (error: any) => {
            console.error('Error ', error);
          },
        });
        break;
      case 'processing':
        this.showMessage('Payment processing');
        break;
      case 'requires_payment_method':
        this.showMessage('Payment failed');
        break;
      case 'canceled':
        this.showMessage('Your payment for the reservation has been canceled');
        break;
      default:
        this.showMessage('Something went wrong');
        break;
    }
  }

  // UI Helpers
  showMessage(messageText: string): void {
    const messageContainer = document.querySelector('#payment-message');
    if (messageContainer !== null) {
      messageContainer.classList.remove('hidden');
      messageContainer.textContent = messageText;
    }
  }
}

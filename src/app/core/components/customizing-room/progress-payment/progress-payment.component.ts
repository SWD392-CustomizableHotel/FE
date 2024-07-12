import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomizeRequest } from '../../../../interfaces/models/customize-request';
import { CustomizeDataService } from '../../../../services/customize-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from '../../../../interfaces/models/room';
import { CancelPaymentService } from '../../../../services/cancel-payment.service';
import { environment } from '../../../../../assets/environments/environment';
import { CustomizingRoomService } from '../../../../services/customizing-room.service';
import { loadStripe } from '@stripe/stripe-js';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicConfirmPaymentComponent } from '../dynamic-confirm-payment/dynamic-confirm-payment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progress-payment',
  templateUrl: './progress-payment.component.html',
  styleUrl: './progress-payment.component.scss',
  providers: [DialogService],
})
export class ProgressPaymentComponent implements OnInit {
  @Input() activeIndex: number = 2;
  @Output() changeActiveIndex = new EventEmitter<number>();
  customizeRequest!: CustomizeRequest | null;
  paymentForm: FormGroup;
  stripe: any;
  elements: any;
  card: any;
  clientSecret?: string;
  paymentIntentId?: string;
  id?: string;
  amount?: number;
  selectedRoomId?: number;
  room?: Room;
  rangeDates?: Date[];
  email?: string;
  numOfDays?: number;
  numberOfRoom?: number;
  secondsRemaining: number;
  minutes: number;
  formattedSeconds: string;
  firstName?: string;
  ref: DynamicDialogRef | undefined;
  paymentStatus?: string;
  disabledState: boolean = true;
  paymentMessage: string = '';

  constructor(
    private customizeDataService: CustomizeDataService,
    private fb: FormBuilder,
    private cancelPaymentService: CancelPaymentService,
    private customizeRoomService: CustomizingRoomService,
    public dialogService: DialogService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      name: [''],
    });
    this.secondsRemaining = 60 * 15;
    this.minutes = Math.floor(this.secondsRemaining / 60);
    this.formattedSeconds = this.formatSeconds(this.secondsRemaining % 60);
  }

  async ngOnInit(): Promise<void> {
    this.customizeRequest = this.customizeDataService.getCustomizeRequest();
    // Initialize Stripe
    this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY);
    try {
      // Get client secret
      this.customizeRoomService
        ?.createStripePayment(this.customizeRequest as CustomizeRequest)
        .subscribe({
          next: (response) => {
            this.clientSecret = response.results?.at(0);
            this.paymentIntentId = response.results?.at(1);

            // Layout payment form
            this.elements = this.stripe.elements();
            const appearance = { theme: 'stripe' };
            this.elements = this.stripe.elements({
              appearance,
              clientSecret: this.clientSecret,
            });

            const paymentElementOptions = { layout: 'tabs' };
            const paymentElement = this.elements.create(
              'payment',
              paymentElementOptions
            );

            // Attach element into HTML
            paymentElement.mount('#payment-element');
            console.log('Payment element mounted');

            // Enable cancel
            const cancelButton = document.getElementById('cancel');
            cancelButton?.classList.remove('hidden');

            //Set Time Out For Payment (15mins * 60seconds)
            this.startCountdown(this.secondsRemaining);
            this.disabledState = false;
          },
          error: () => {
            this.router.navigate(['/login']);
          },
        });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
    this.checkStatus();
  }

  startCountdown(seconds: number): void {
    this.secondsRemaining = seconds;

    const countdown = setInterval(() => {
      this.secondsRemaining--;
      this.minutes = Math.floor(this.secondsRemaining / 60);
      this.formattedSeconds = this.formatSeconds(this.secondsRemaining % 60);

      if (this.secondsRemaining <= 0) {
        clearInterval(countdown);
        this.cancelPayment();
      }
    }, 1000);
  }

  async cancelPayment(): Promise<void> {
    try {
      this.cancelPaymentService?.cancelPayment(this.paymentIntentId).subscribe({
        next: (response: any) => {
          console.log(response);
          this.paymentStatus = 'canceled';
          this.ref = this.dialogService.open(DynamicConfirmPaymentComponent, {
            data: {
              clientSecret: this.clientSecret,
              status: 'canceled',
            },
            closable: false,
            header: 'Payment Result',
          });

          this.ref.onClose.subscribe(() => {
            this.changeActiveIndex.emit(0);
          });
        },
        error: () => {
          this.router.navigate(['/login']);
        },
      });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  formatSeconds(seconds: number): string {
    return seconds < 10 ? '0' + seconds : seconds.toString();
  }

  async handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    this.setLoading(true);

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        this.paymentMessage = error.message;
      } else {
        this.paymentMessage = 'An unexpected error occurred.';
      }
    } else {
      // Open the dynamic dialog based on payment status
      let status: string;
      switch (paymentIntent.status) {
        case 'succeeded':
          status = 'success';
          break;
        case 'processing':
          status = 'processing';
          break;
        case 'requires_payment_method':
          status = 'failed';
          break;
        default:
          status = 'unknown';
          break;
      }

      this.ref = this.dialogService.open(DynamicConfirmPaymentComponent, {
        header: 'Confirm Payment',
        width: '50%',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        baseZIndex: 10000,
        data: {
          status: status,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          paymentMessage: this.paymentMessage,
        },
        closable: false
      });

      this.ref.onClose.subscribe(() => {
        if (status === 'success') {
          // quay ve home
          this.router.navigate(['/']);
        } else {
          this.changeActiveIndex.emit(0);
        }
      });
    }

    this.setLoading(false);
  }

  async checkStatus(): Promise<void> {
    if (this.clientSecret) {
      const { paymentIntent } = await this.stripe.retrievePaymentIntent(
        this.clientSecret
      );
      switch (paymentIntent.status) {
        case 'succeeded':
          this.paymentMessage = 'Payment succeed';
          break;
        case 'processing':
          this.paymentMessage = 'Payment processing';
          break;
        case 'requires_payment_method':
          this.paymentMessage = 'Payment failed';
          break;
        default:
          this.paymentMessage = 'Something went wrong';
          break;
      }
    }
  }

  setLoading(isLoading: boolean): void {
    const submitButton = document.querySelector('#submit') as HTMLButtonElement;
    const spinnerButton = document.querySelector('#spinner');
    const textButton = document.querySelector('#button-text');
    if (isLoading) {
      // Disable the button and show a spinner
      if (
        submitButton !== null &&
        spinnerButton !== null &&
        textButton !== null
      ) {
        submitButton.disabled = true;
        spinnerButton.classList.remove('hidden');
        textButton.classList.add('hidden');
      }
    } else {
      if (
        submitButton !== null &&
        spinnerButton !== null &&
        textButton !== null
      ) {
        submitButton.disabled = false;
        spinnerButton.classList.add('hidden');
        textButton.classList.remove('hidden');
      }
    }
  }
}

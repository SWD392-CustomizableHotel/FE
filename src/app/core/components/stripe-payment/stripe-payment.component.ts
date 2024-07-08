import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StripePaymentService } from '../../../services/stripe-payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/view.room.service';
import { Room } from '../../../interfaces/models/room';
import { UserBookingService } from '../../../services/user-booking.service';
import { firstValueFrom } from 'rxjs';
import { CancelPaymentService } from '../../../services/cancel-payment.service';
import { environment } from '../../../../assets/environments/environment';
@Component({
  selector: 'app-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
})
export class StripePaymentComponent implements OnInit {
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

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private paymentItentService: StripePaymentService,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private userBookingData: UserBookingService,
    private cancelPaymentService: CancelPaymentService,
    private router: Router
  ) {
    // this.paymentService = new StripePaymentService(new HttpClient();
    this.paymentForm = this.fb.group({
      name: [''],
    });
    this.secondsRemaining = 60 * 15;
    this.minutes = Math.floor(this.secondsRemaining / 60);
    this.formattedSeconds = this.formatSeconds(this.secondsRemaining % 60);
  }

  async ngOnInit(): Promise<void> {

    const idParam = this.route.snapshot.paramMap.get('id');
    this.selectedRoomId = idParam ? parseInt(idParam, 10) : NaN;
    const emailParam = this.route.snapshot.paramMap.get('email');
    this.email = emailParam ? emailParam : '';
    const firstNameParam = this.route.snapshot.paramMap.get('firstName');
    this.firstName = firstNameParam ? firstNameParam : '';
    this.room = await firstValueFrom(
      this.roomService.getRoomDetails(this.selectedRoomId)
    );

    this.userBookingData.currentRangeDates.subscribe((rangeDates) => {
      this.rangeDates = rangeDates;
      console.log(rangeDates);
      if (this.rangeDates !== undefined) {
        const start = this.rangeDates[0];
        const end = this.rangeDates[1];
        this.numOfDays = Math.round(
          (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        );
      } else {
        console.log('Unavailable range dates');
      }
      this.userBookingData.currentPeopleCount.subscribe((peopleCount) => {
        this.numberOfRoom = peopleCount.rooms;
      });
    });

    // Initialize Stripe
    this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY);
    try {
      // Get client secret
      this.paymentItentService
        ?.createStripePayment(
          this.selectedRoomId.toString(),
          this.room?.price,
          this.numOfDays,
          this.numberOfRoom,
          this.email,
          this.firstName
        )
        .subscribe({
          next: (response: any) => {
            this.clientSecret = response[0];
            this.paymentIntentId = response[1];

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
          },
          error: (err: any) => {
            console.error('Error creating payment:', err);
          },
        });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
    this.checkStatus();
    // document
    //   .querySelector('#payment-form')
    //   ?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e: any): Promise<void> {
    e.preventDefault();
    this.setLoading(true);

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: 'http://localhost:4200/confirm-payment',
      },
    });
    if (error.type === 'card_error' || error.type === 'validation_error') {
      this.showMessage(error.message);
    } else {
      this.showMessage('An unexpected error occurred.');
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
          this.showMessage('Payment succeed');
          break;
        case 'processing':
          this.showMessage('Payment processing');
          break;
        case 'requires_payment_method':
          this.showMessage('Payment failed');
          break;
        default:
          this.showMessage('Something went wrong');
          break;
      }
    }
  }

  async cancelPayment(): Promise<void> {
    try {
      this.cancelPaymentService?.cancelPayment(this.paymentIntentId).subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigate([`/confirm-payment`], {
            queryParams: { payment_intent_client_secret: this.clientSecret },
          });
        },
        error: (error: any) => {
          console.error('Error canceling payment:', error);
        },
      });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  // UI Helpers
  showMessage(messageText: string): void {
    console.log(messageText);
    const messageContainer = document.querySelector('#payment-message');
    if (messageContainer !== null) {
      messageContainer.classList.remove('hidden');
      messageContainer.textContent = messageText;
    }

    setTimeout(function () {
      if (messageContainer !== null) {
        messageContainer.classList.add('hidden');
        messageContainer.textContent = '';
      }
    }, 4000);
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

  formatSeconds(seconds: number): string {
    return seconds < 10 ? '0' + seconds : seconds.toString();
  }
}
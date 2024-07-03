  import { Component, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { loadStripe } from '@stripe/stripe-js';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { StripePaymentService } from '../../../services/stripe-payment.service';
  import { ActivatedRoute } from '@angular/router';
  import { RoomService } from '../../../services/view.room.service';
  import { Room } from '../../../interfaces/models/rooms';
  import { UserBookingService } from '../../../services/user-booking.service';
  import { firstValueFrom } from 'rxjs';
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
    clientSecret? : string;
    id? : string;
    amount?: number;
    selectedRoomId?: number;
    room?: Room;
    rangeDates?: Date[];
    email?: string;
    numOfDays?: number;

    constructor(private http: HttpClient,
      private fb: FormBuilder,
      private paymentService: StripePaymentService,
      private route: ActivatedRoute,
      private roomService: RoomService,
      private userBookingData: UserBookingService) {
      // this.paymentService = new StripePaymentService(new HttpClient();
      this.paymentForm = this.fb.group({
        name: [''],
      });
    }

    async ngOnInit(): Promise<void> {
      const idParam = this.route.snapshot.paramMap.get('id');
      this.selectedRoomId = idParam ? parseInt(idParam, 10) : NaN;
      const emailParam = this.route.snapshot.paramMap.get('email');
      this.email = emailParam ? emailParam : '';
      this.room = await firstValueFrom(this.roomService.getRoomDetails(this.selectedRoomId));
      // this.roomService.getRoomDetails(this.selectedRoomId).subscribe(
      //   (response: Room) => {
      //     this.room = response;
      //   }
      // );

      this.userBookingData.currentRangeDates.subscribe((rangeDates) => {
        this.rangeDates = rangeDates;
        if (this.rangeDates !== undefined) {
          const start = this.rangeDates[0];
          const end = this.rangeDates[1];
          this.numOfDays = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        } else {
          console.log('Unavailable range dates');
        }


      });
      // Initialize Stripe
      this.stripe = await loadStripe('pk_test_51PVP1yP7srpKRMQLK0pKqvXlaDT2Gm9spkU73T9nH43Lq5crcwI1rp0dNOn7VLA6FDKql8BxFn546RdqITdz1RSm00J8e6HLMI');
      try {
        // Get client secret
        this.paymentService?.createStripePayment(this.selectedRoomId.toString(), this.room?.roomPrice, this.numOfDays, 2, this.email).subscribe({
          next: (response: any) => {
            this.clientSecret = response.clientSecret;

            // Layout payment form
            this.elements = this.stripe.elements();
            const appearance = { theme: 'stripe' };
            this.elements = this.stripe.elements({ appearance, clientSecret: this.clientSecret });

            const paymentElementOptions = { layout: 'tabs' };
            const paymentElement = this.elements.create('payment', paymentElementOptions);

            // Attach element into HTML
            paymentElement.mount('#payment-element');
            console.log('Payment element mounted');
          },
          error: (err: any) => {
            console.error('Error creating payment:', err);
          }
        });
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
      this.checkStatus();
      document.querySelector('#payment-form')?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e : any) : Promise<void> {
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

    async checkStatus() : Promise<void> {
      if (this.clientSecret) {
        const { paymentIntent } = await this.stripe.retrievePaymentIntent(this.clientSecret);
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

    // UI Helpers
    showMessage(messageText : string) : void {
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

    setLoading(isLoading : boolean) : void {
      const submitButton = document.querySelector('#submit') as HTMLButtonElement;
      const spinnerButton = document.querySelector('#spinner');
      const textButton = document.querySelector('#button-text');
      if (isLoading) {
        // Disable the button and show a spinner
        if (submitButton !== null && spinnerButton !== null && textButton !== null) {
          submitButton.disabled = true;
          spinnerButton.classList.remove('hidden');
          textButton.classList.add('hidden');
        }
      } else {
        if (submitButton !== null && spinnerButton !== null && textButton !== null) {
          submitButton.disabled = false;
          spinnerButton.classList.add('hidden');
          textButton.classList.remove('hidden');
        }
      }
    }
  }
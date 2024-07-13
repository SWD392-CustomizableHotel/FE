import { Component, OnInit } from '@angular/core';
import { SendInvoiceService } from '../../../../services/send-invoice.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../../../assets/environments/environment';
import { CustomizeDataService } from '../../../../services/customize-data.service';
import { CustomizingRoomService } from '../../../../services/customizing-room.service';
import { CustomizeBooking } from '../../../../interfaces/models/customize-booking';
import { CustomizeRequest } from '../../../../interfaces/models/customize-request';
import { Payment } from '../../../../interfaces/models/payment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-confirm-payment',
  templateUrl: './dynamic-confirm-payment.component.html',
  styleUrls: ['./dynamic-confirm-payment.component.scss'],
})
export class DynamicConfirmPaymentComponent implements OnInit {
  stripe: any;
  invoiceDownloadLink = '';
  invoiceHostedPages = '';
  bookingCode?: string;
  paymentCode?: string;
  bookingAmenityCode?: string;
  bookingId?: number;
  totalPrice?: number;
  status?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  canvasBlob!: Blob;
  customizeBookingRequest!: CustomizeBooking;
  customizeRequest!: CustomizeRequest;
  payment?: Payment;
  paymentMessage: string = '';

  constructor(
    private sendMailService: SendInvoiceService,
    private customizeRoomService: CustomizingRoomService,
    public ref: DynamicDialogRef,
    public refConfig: DynamicDialogConfig,
    private customizeDataService: CustomizeDataService,
    private router: Router
  ) {
    if (this.refConfig.data) {
      this.status = this.refConfig.data.status;
      this.paymentIntentId = this.refConfig.data.paymentIntentId;
      this.clientSecret = this.refConfig.data.clientSecret;
      this.paymentMessage = this.refConfig.data.paymentMessage;
    }
  }

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY);
    this.canvasBlob = this.customizeDataService.getCanvasBlobImage()!;
    this.customizeRequest = this.customizeDataService.getCustomizeRequest()!;

    if (this.status === 'canceled') {
      this.showMessage('Your payment for the reservation has been canceled');
      return;
    }

    if (this.status === 'success') {
      this.checkStatus();
    } else {
      this.showMessage(`Payment ${this.status}`);
    }
  }

  async checkStatus(): Promise<void> {
    if (!this.clientSecret) {
      console.error('Client secret is undefined');
      return;
    }

    if (!this.stripe) {
      console.error('Stripe is not initialized');
      return;
    }

    this.bookingCode = 'B_' + this.paymentIntentId;
    this.paymentCode = 'P_' + this.paymentIntentId;
    this.bookingAmenityCode = 'BA_' + this.paymentIntentId;

    const { paymentIntent } = await this.stripe.retrievePaymentIntent(
      this.clientSecret
    );
    if (!paymentIntent) {
      console.error('Payment Intent is undefined');
      return;
    }
    switch (paymentIntent.status) {
      case 'succeeded':
        this.showMessage(
          'Your payment for the reservation has been successfully completed!'
        );
        this.customizeBookingRequest = {
          amenityId: this.customizeRequest.amenityId,
          roomId: +this.customizeRequest.roomId,
          startDate: this.customizeDataService.getDateRange()[0],
          endDate: this.customizeDataService.getDateRange()[1],
          bookingCode: this.bookingCode,
          amenityBookingCode: this.bookingAmenityCode
        };
        this.customizeRoomService
          .createRoomBookingAndAmenityBooking(this.customizeBookingRequest)
          .subscribe({
            next: (response) => {
              if (response.isSucceed) {
                this.totalPrice = paymentIntent.amount / 100;
                this.bookingId = +response.result!;
                // Tạo payment, update status phòng
                this.payment = {
                  code: this.paymentCode,
                  amount: this.totalPrice = paymentIntent.amount / 100,
                  status: 'Success',
                  paymentIntentId: this.paymentIntentId,
                  bookingId: +response.result!,
                  startDate: this.customizeDataService.getDateRange()[0],
                  endDate: this.customizeDataService.getDateRange()[1]
                };
                // Lấy bookingId từ response
                this.customizeRoomService
                .createPayment(this.payment).subscribe(
                  () => {
                    // Upload canvas and update room status
                    this.customizeRoomService
                    .uploadCanvasAndUpdateRoomStatus(
                      this.canvasBlob,
                      +this.customizeRequest.roomId
                    )
                    .subscribe({
                      next: (res) => {
                        if (res.isSucceed) {
                          console.log(
                            'Canvas image uploaded and room status updated'
                          );
                        } else {
                          console.error(
                            'Failed to upload canvas image and update room status'
                          );
                        }
                      },
                      error: (error) => {
                        console.error(
                          'Error uploading canvas image: ',
                          error
                        );
                      },
                    });
                  }
                );
              } else {
                console.error('Cannot create booking room and amenity');
              }
            },
            error: () => {
              this.router.navigate(['/login']);
            },
          });
        this.sendMailService.getInvoiceLink(this.paymentIntentId).subscribe({
          next: (response: any) => {
            console.log(response);
            this.invoiceDownloadLink = response[0];
            this.invoiceHostedPages = response[1];
            console.log(this.invoiceDownloadLink);
          },
          error: () => {
            this.router.navigate(['/login']);
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

  showMessage(messageText: string): void {
    const messageContainer = document.querySelector('#payment-message');
    if (messageContainer !== null) {
      messageContainer.classList.remove('hidden');
      messageContainer.textContent = messageText;
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}

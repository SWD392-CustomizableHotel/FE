import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { ViewAvailableRoomComponent } from './core/components/view-available-room/view-available-room.component';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { BookingHistoryComponent } from './core/components/booking-history/booking-history.component';
import { BookingRoomComponent } from './core/components/booking-room/booking-room.component';
import { StripePaymentComponent } from './core/components/stripe-payment/stripe-payment.component';
import { ConfirmPaymentComponent } from './core/components/confirm-payment/confirm-payment.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { CheckOutComponent } from './core/components/check-out/check-out.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./core/components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/components/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./core/components/main/main.module').then(
            (m) => m.MainModule
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'notfound',
    component: NotfoundComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },
  {
    path: 'update-profile',
    component: ProfileComponent,
  },
  {
    path: 'view-available-room',
    component: ViewAvailableRoomComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './core/components/view-available-room/view-available-room.module'
          ).then((m) => m.ViewAvailableRoomModule),
      },
    ],
  },
  {
    path: 'booking-history',
    component: BookingHistoryComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './core/components/booking-history/booking-history.module'
          ).then((m) => m.BookingHistoryModule),
      },
    ]
  },
 {
    path: 'booking-room/:id',
    component: BookingRoomComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/components/booking-room/booking-room.module').then(
            (m) => m.BookingRoomModule
          ),
      },
    ],
  },
  {
    path: 'stripe-payment/:id/:firstName/:lastName/:email',
    component: StripePaymentComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/components/stripe-payment/stripe-payment.module').then(
            (m) => m.StripePaymentModule
          ),
      },
    ],
  },
  {
    path: 'confirm-payment',
    component: ConfirmPaymentComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./core/components/confirm-payment/confirm-payment.module').then(
            (m) => m.ConfirmPaymentModule
          ),
      },
    ],
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './core/components/check-out/check-out.module'
          ).then((m) => m.CheckOutModule),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'notfound',
  },

  // { path: '', component: HomeComponent },
  // { path: 'login', component: LoginComponent },

  // // otherwise redirect to home
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}


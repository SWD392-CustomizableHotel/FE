import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { ResetPasswordComponent } from './core/components/reset-password/reset-password.component';
import { RegisterComponent } from './core/components/register/register.component';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';

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
    path: 'register',
    component: RegisterComponent,
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
    path: '**',
    redirectTo: 'notfound',
  },
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

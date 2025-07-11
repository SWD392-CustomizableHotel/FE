import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomsModule } from './rooms/rooms.module';
import { ManageAccountsModule } from './manage-accounts/manage-accounts.module';
import { ManageAmenitiesModule } from './manage-amentities/manage-amenities.module';
import { ManageServicesModule } from './manage-services/manage-services.module';
import { UploadIdentityCardModule } from './upload-identity-card/upload-identity-card.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'rooms',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof RoomsModule> =>
          import('./rooms/rooms.module').then((m) => m.RoomsModule),
      },
      {
        path: 'accounts',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof ManageAccountsModule> =>
          import('./manage-accounts/manage-accounts.module').then(
            (m) => m.ManageAccountsModule
          ),
      },
      {
        path: 'manage-amenities',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof ManageAmenitiesModule> =>
          import('./manage-amentities/manage-amenities.module').then(
            (m) => m.ManageAmenitiesModule
          ),
      },
      {
        path: 'manage-services',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof ManageServicesModule> =>
          import('./manage-services/manage-services.module').then(
            (m) => m.ManageServicesModule
          ),
      },
      {
        path: 'upload-identity-card',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof UploadIdentityCardModule> =>
          import('./upload-identity-card/upload-identity-card.module').then(
            (m) => m.UploadIdentityCardModule
          ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MainRoutingModule {}

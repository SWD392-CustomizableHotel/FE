import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomsModule } from './rooms/rooms.module';
import { ManageAccountsModule } from './manage-accounts/manage-accounts.module';
import { ManageAmenitiesModule } from './manage-amentities/manage-amenities.module';

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
        path: 'manage-amenities',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof import('./manage-amentities/manage-amenities.module').ManageAmenitiesModule> =>
          import('./manage-amentities/manage-amenities.module').then((m) => m.ManageAmenitiesModule),
      },
      {
        path: 'accounts',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof ManageAccountsModule> =>
          import('./manage-accounts/manage-accounts.module').then((m) => m.ManageAccountsModule),
      },
      {
        path: 'manage-amenities',
        data: { breadcrumb: '' },
        loadChildren: (): Promise<typeof ManageAmenitiesModule> =>
          import('./manage-amentities/manage-amenities.module').then((m) => m.ManageAmenitiesModule),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MainRoutingModule {}
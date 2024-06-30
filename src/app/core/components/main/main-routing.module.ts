import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomsModule } from './rooms/rooms.module';
import { ManageAccountsModule } from './manage-accounts/manage-accounts.module';

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
          import('./manage-accounts/manage-accounts.module').then((m) => m.ManageAccountsModule),
      }
    ]),
  ],
  exports: [RouterModule],
})
export class MainRoutingModule {}

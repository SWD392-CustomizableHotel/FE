import { NgModule } from '@angular/core';
import { ManageAccountsComponent } from './manage-accounts.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'all-accounts', component: ManageAccountsComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}

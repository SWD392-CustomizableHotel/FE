import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageServicesComponent } from './manage-services.component';

const routes: Routes = [{ path: '', component: ManageServicesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageServicesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadIdentityCardComponent } from './upload-identity-card.component';

const routes: Routes = [
  { path: '', component: UploadIdentityCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadIdentityCardRoutingModule { }
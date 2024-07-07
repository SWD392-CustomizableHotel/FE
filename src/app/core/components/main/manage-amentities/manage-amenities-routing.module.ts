import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAmenitiesComponent } from './manage-amenities.component';

const routes: Routes = [
  { path: '', component: ManageAmenitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAmenitiesRoutingModule { }
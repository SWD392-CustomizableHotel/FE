import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomsComponent } from './rooms.component';

@NgModule({
    imports: [RouterModule.forChild([
        {path: 'all-rooms', component : RoomsComponent}
    ])],
    exports: [RouterModule]
})

export class RoomsRoutingModule {}
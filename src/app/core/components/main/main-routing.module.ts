import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomsModule } from './rooms/rooms.module';

@NgModule({
    imports: [RouterModule.forChild([
        {path: 'rooms',
        data: { breadcrumb: '' }, loadChildren: (): Promise<typeof RoomsModule> => import('./rooms/rooms.module').then(m => m.RoomsModule) }
    ])],
    exports: [RouterModule]
})
export class MainRoutingModule {}
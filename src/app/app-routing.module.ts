import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { LayoutComponent } from './core/components/layout/layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { 
                path: '', 
                loadChildren: () => import('./core/components/home/home.module').then(m => m.HomeModule)
            },
        ],
    },
    {
        path: 'login',
        component: LoginComponent
    }
    // { path: '', component: HomeComponent },
    // { path: 'login', component: LoginComponent },

    // // otherwise redirect to home
    // { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'MCRCO_Sucursales',
        loadChildren: () => import('./mcrco.sucursales/mcrco.sucursales.module').then(mod => mod.McrcoSucursalesModule),
        //canActivate: [AuthGuard]
    },
    {
        path: '',
        children: [ ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RentalsRoutingModule { }

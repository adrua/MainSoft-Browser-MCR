import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'MCRCO_Automoviles',
        loadChildren: () => import('./mcrco.automoviles/mcrco.automoviles.module').then(mod => mod.McrcoAutomovilesModule),
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

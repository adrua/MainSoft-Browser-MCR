import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { McrcoSucursalesTable } from './mcrco.sucursales.table';
import { McrcoSucursalesDialog } from './mcrco.sucursales.dialog';

const routes: Routes = [
    {
        path: '',
        component: McrcoSucursalesTable
    },
    {
        path: 'McrcoSucursalesTable',
        component: McrcoSucursalesTable
    },
    {
        path: 'McrcoSucursalesDialog',
        component: McrcoSucursalesDialog
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class McrcoSucursalesRoutingModule { }

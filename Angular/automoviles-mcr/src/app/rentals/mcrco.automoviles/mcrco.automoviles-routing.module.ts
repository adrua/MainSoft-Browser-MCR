import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { McrcoAutomovilesTable } from './mcrco.automoviles.table';
import { McrcoAutomovilesDialog } from './mcrco.automoviles.dialog';

const routes: Routes = [
    {
        path: '',
        component: McrcoAutomovilesTable
    },
    {
        path: 'McrcoAutomovilesTable',
        component: McrcoAutomovilesTable
    },
    {
        path: 'McrcoAutomovilesDialog',
        component: McrcoAutomovilesDialog
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class McrcoAutomovilesRoutingModule { }

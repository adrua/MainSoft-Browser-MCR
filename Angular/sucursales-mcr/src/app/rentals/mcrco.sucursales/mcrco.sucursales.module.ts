import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../app.shared.module';
import { AppMaterialModule } from '../../app.material.module';

import { McrcoSucursalesRoutingModule } from './mcrco.sucursales-routing.module';

import { McrcoSucursalesTable } from './mcrco.sucursales.table';
import { McrcoSucursalesDialog } from './mcrco.sucursales.dialog';


@NgModule({
  declarations: [
    McrcoSucursalesTable,
    McrcoSucursalesDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    McrcoSucursalesRoutingModule
  ],
  entryComponents: [
    McrcoSucursalesTable,
    McrcoSucursalesDialog
  ],
  exports: [
    McrcoSucursalesTable,
    McrcoSucursalesDialog
  ]
})
export class McrcoSucursalesModule { }

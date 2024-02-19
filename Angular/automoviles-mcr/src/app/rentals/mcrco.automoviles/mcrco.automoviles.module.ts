import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../app.shared.module';
import { AppMaterialModule } from '../../app.material.module';

import { McrcoAutomovilesRoutingModule } from './mcrco.automoviles-routing.module';

import { McrcoAutomovilesTable } from './mcrco.automoviles.table';
import { McrcoAutomovilesDialog } from './mcrco.automoviles.dialog';


@NgModule({
  declarations: [
    McrcoAutomovilesTable,
    McrcoAutomovilesDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    McrcoAutomovilesRoutingModule
  ],
  entryComponents: [
    McrcoAutomovilesTable,
    McrcoAutomovilesDialog
  ],
  exports: [
    McrcoAutomovilesTable,
    McrcoAutomovilesDialog
  ]
})
export class McrcoAutomovilesModule { }

import { NgModule } from '@angular/core';
import { SucursalesMcrComponent } from './sucursales-mcr.component';
import { ArkeosComponentsModule, ArkeosSharedModule } from 'arkeos-components';
import { McrcoSucursalesModule } from '../app/rentals/mcrco.sucursales/mcrco.sucursales.module';
import { SharedModule } from '../app/app.shared.module';

@NgModule({
  declarations: [SucursalesMcrComponent],
  imports: [
	SharedModule,
	McrcoSucursalesModule,
    ArkeosComponentsModule, 
    ArkeosSharedModule
  ],
  exports: [SucursalesMcrComponent]
})
export class SucursalesMcrModule { }
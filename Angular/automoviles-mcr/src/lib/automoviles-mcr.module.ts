import { NgModule } from '@angular/core';
import { AutomovilesMcrComponent } from './automoviles-mcr.component';
import { ArkeosComponentsModule, ArkeosSharedModule } from 'arkeos-components';
import { McrcoAutomovilesModule } from '../app/rentals/mcrco.automoviles/mcrco.automoviles.module';
import { SharedModule } from '../app/app.shared.module';

@NgModule({
  declarations: [AutomovilesMcrComponent],
  imports: [
	SharedModule,
	McrcoAutomovilesModule,
    ArkeosComponentsModule, 
    ArkeosSharedModule
  ],
  exports: [AutomovilesMcrComponent]
})
export class AutomovilesMcrModule { }
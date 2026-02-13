import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { EmployerPlacementComponent } from './employer-placement.component';
import { EmployerPlacementRoutingModule } from './employer-placement-routing.module';


@NgModule({
  declarations: [
    EmployerPlacementComponent,
    // StudentFilterPipe
  ],
  imports: [
    CommonModule,
    EmployerPlacementRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerPlacementModule { }

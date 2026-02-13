
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { EmployerPlacementDetailsComponent } from './employer-placement-details.component';
import { EmployerPlacementDetailsRoutingModule } from './employer-placement-details-routing.module';


@NgModule({
  declarations: [
    EmployerPlacementDetailsComponent
  ],
  imports: [
    CommonModule,
    EmployerPlacementDetailsRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerPlacementDetailsModule { }

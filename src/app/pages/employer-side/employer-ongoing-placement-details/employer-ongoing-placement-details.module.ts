import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerOngoingPlacementDetailsRoutingModule } from './employer-ongoing-placement-details-routing.module';
import { EmployerOngoingPlacementDetailsComponent } from './employer-ongoing-placement-details.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    EmployerOngoingPlacementDetailsComponent
  ],
  imports: [
    CommonModule,
    EmployerOngoingPlacementDetailsRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerOngoingPlacementDetailsModule { }

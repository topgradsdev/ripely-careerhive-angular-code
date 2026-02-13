import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerOngoingPlacementRoutingModule } from './employer-ongoing-placement-routing.module';
import { EmployerOngoingPlacementComponent } from './employer-ongoing-placement.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
import { StudentFilterPipe } from '../../../../pipes/student-search-pipe';
// import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    EmployerOngoingPlacementComponent,
    // StudentFilterPipe
  ],
  imports: [
    CommonModule,
    EmployerOngoingPlacementRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerOngoingPlacementModule { }

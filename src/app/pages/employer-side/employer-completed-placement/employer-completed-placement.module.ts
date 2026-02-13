import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerCompletedPlacementRoutingModule } from './employer-completed-placement-routing.module';
import { EmployerCompletedPlacementComponent } from './employer-completed-placement.component';
import { MaterialModule } from '../../../material.module';
// import { ChartsModule } from 'ng2-charts';
import { StudentFilterPipe } from '../../../../pipes/student-search-pipe';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    EmployerCompletedPlacementComponent,
    // StudentFilterPipe
  ],
  imports: [
    CommonModule,
    EmployerCompletedPlacementRoutingModule,
    MaterialModule,
    // ChartsModule,
    SharedModule
  ]
})
export class EmployerCompletedPlacementModule { }

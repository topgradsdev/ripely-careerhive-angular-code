
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { EmployerProjectDetailsComponent } from './employer-project-details.component';
import { EmployerProjectDetailsRoutingModule } from './employer-project-details-routing.module';

@NgModule({
  declarations: [
    EmployerProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    EmployerProjectDetailsRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerProjectDetailsModule { }

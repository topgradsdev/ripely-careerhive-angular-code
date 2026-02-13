import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { EmployerProjectRoutingModule } from './employer-project-routing.module';
import { EmployerProjectComponent } from './employer-project.component';


@NgModule({
  declarations: [
    EmployerProjectComponent,
    // StudentFilterPipe
  ],
  imports: [
    CommonModule,
    EmployerProjectRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class EmployerProjectModule { }

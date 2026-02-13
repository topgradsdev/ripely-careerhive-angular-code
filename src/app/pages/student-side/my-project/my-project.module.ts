import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { MyProjectRoutingModule } from './my-project-routing.module';
import { MyProjectComponent } from './my-project.component';


@NgModule({
  declarations: [
    MyProjectComponent,
    // StudentFilterPipe
  ],
  imports: [
    CommonModule,
    MyProjectRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ]
})
export class MyProjectModule { }

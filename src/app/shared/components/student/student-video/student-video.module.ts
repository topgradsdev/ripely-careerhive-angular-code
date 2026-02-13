import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';
import { StudentVideoRoutingModule } from './student-vide-routing.module';
import { StudentVideoComponent } from './student-video.component';


@NgModule({
  declarations: [
    StudentVideoComponent
  ],
  imports: [
    CommonModule,
    StudentVideoRoutingModule,
    MaterialModule,
    NgSelectModule,
    NgxMaterialTimepickerModule
  ]
})
export class StudentVideoModule { }

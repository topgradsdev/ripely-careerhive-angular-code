import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentFormRoutingModule } from './student-form-routing.module';
import { StudentFormComponent } from './student-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';


@NgModule({
  declarations: [
    StudentFormComponent
  ],
  imports: [
    CommonModule,
    StudentFormRoutingModule,
    MaterialModule,
    NgSelectModule,
    NgxMaterialTimepickerModule
  ]
})
export class StudentFormModule { }

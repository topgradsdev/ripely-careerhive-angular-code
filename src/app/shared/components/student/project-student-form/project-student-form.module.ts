import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectStudentFormRoutingModule } from './project-student-form-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';
import { ProjectStudentFormComponent } from './project-student-form.component';


@NgModule({
  declarations: [
    ProjectStudentFormComponent
  ],
  imports: [
    CommonModule,
    ProjectStudentFormRoutingModule,
    MaterialModule,
    NgSelectModule,
    NgxMaterialTimepickerModule
  ]
})
export class ProjectStudentFormModule { }

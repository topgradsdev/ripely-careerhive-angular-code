import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerStudentFormComponent } from './employer-student-form.component';
import { EmployerStudentFormRoutingModule } from './employer-student-form-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';



@NgModule({
declarations: [
  EmployerStudentFormComponent
],
imports: [
  CommonModule,
  EmployerStudentFormRoutingModule,
  MaterialModule,
  NgSelectModule,
  NgxMaterialTimepickerModule
]
})
export class EmployerStudentFormModule { }

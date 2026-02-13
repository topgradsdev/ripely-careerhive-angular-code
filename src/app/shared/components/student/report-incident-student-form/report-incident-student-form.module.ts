import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportIncidentStudentFormRoutingModule } from './report-incident-student-form-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';
import { ReportIncidentStudentFormComponent } from './report-incident-student-form.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    ReportIncidentStudentFormComponent
  ],
  imports: [
    CommonModule,
    ReportIncidentStudentFormRoutingModule,
    MaterialModule,
    NgSelectModule,
    ModalModule,
    NgxMaterialTimepickerModule
  ]
})
export class ReportIncidentStudentFormModule { }

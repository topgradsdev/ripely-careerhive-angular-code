import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportIncidentEmployerFormComponent } from './report-incident-employer-form.component';
import { ReportIncidentEmployerFormRoutingModule } from './report-incident-employer-form-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MaterialModule } from '../../../../material.module';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
declarations: [
  ReportIncidentEmployerFormComponent
],
imports: [
  CommonModule,
  ReportIncidentEmployerFormRoutingModule,
  MaterialModule,
  NgSelectModule,
  ModalModule,
  NgxMaterialTimepickerModule
]
})
export class ReportIncidentEmployerFormModule { }

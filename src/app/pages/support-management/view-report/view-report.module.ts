import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewReportRoutingModule } from './view-report-routing.module';
import { ViewReportComponent } from './view-report.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ViewReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ViewReportRoutingModule
  ]
})
export class ViewReportModule { }

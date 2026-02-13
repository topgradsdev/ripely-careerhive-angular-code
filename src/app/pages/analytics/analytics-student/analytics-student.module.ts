import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsStudentRoutingModule } from './analytics-student-routing.module';
import { AnalyticsStudentComponent } from './analytics-student.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../../../material.module';
import { AnalyticsStudentFilteringComponent } from './analytics-student-filtering/analytics-student-filtering.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/shared.module';
import { StudentCreateNewProcessComponent } from './student-create-new-process/student-create-new-process.component';
// import { ChartsModule } from 'ng2-charts';
import { AnalyticsViewAllStudentComponent } from './analytics-view-all-student/analytics-view-all-student.component';


@NgModule({
  declarations: [
    AnalyticsStudentComponent,
    AnalyticsStudentFilteringComponent,
    StudentCreateNewProcessComponent,
    AnalyticsViewAllStudentComponent
  ],
  imports: [
    CommonModule,
    AnalyticsStudentRoutingModule,
    // PerfectScrollbarModule,
    MaterialModule,
    NgSelectModule,
    // ChartsModule,
    SharedModule
  ]
})
export class AnalyticsStudentModule { }

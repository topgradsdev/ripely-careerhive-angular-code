import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsStudentComponent } from './analytics-student.component';
import { AnalyticsStudentFilteringComponent } from './analytics-student-filtering/analytics-student-filtering.component';
import { StudentCreateNewProcessComponent } from './student-create-new-process/student-create-new-process.component';
import { AnalyticsViewAllStudentComponent } from './analytics-view-all-student/analytics-view-all-student.component';

const routes: Routes = [
  {
    path: '',
		component: AnalyticsStudentComponent
  },
  {
    path: 'filtering',
		component: AnalyticsStudentFilteringComponent
  },
  {
    path: 'create-new-filter',
		component: StudentCreateNewProcessComponent
  },
  {
    path: 'view-all-student',
		component: AnalyticsViewAllStudentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsStudentRoutingModule { }

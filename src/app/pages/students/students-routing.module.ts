import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsListComponent } from './students-list/students-list.component';
import { ResumeReviewComponent } from './resume-review/resume-review.component';
import { CompanyStudentsListComponent } from './company-students-list/company-students-list.component';
import { CompanyIncidentReportingListComponent } from './company-incident-reporting-list/company-incident-reporting-list.component';

const routes: Routes = [
  {
		path: 'students-list',
		component: StudentsListComponent
	},
   {
		path: 'resume-review-list',
		component: ResumeReviewComponent
	},
	{
		path: 'company-students-list',
		component: CompanyStudentsListComponent
	},
	{
		path: 'incident-reporting-list',
		component: CompanyIncidentReportingListComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }

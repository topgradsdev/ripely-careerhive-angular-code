import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecruitmentSolutionsManagementComponent } from './recruitment-solutions-management.component';

const routes: Routes = [
	{
		path:'',
		component: RecruitmentSolutionsManagementComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentSolutionsManagementRoutingModule { }

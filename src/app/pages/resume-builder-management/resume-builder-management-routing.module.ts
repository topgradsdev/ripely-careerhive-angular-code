import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResumeBuilderManagementComponent } from './resume-builder-management.component';


const routes: Routes = [
	{
		path:'',
		component: ResumeBuilderManagementComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeBuilderManagementRoutingModule { }

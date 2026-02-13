import { NgModule } from '@angular/core';
import { EmployerJobPostComponent } from './employer-job-post.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'r',
		component: EmployerJobPostComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerJobPostRoutingModule { }

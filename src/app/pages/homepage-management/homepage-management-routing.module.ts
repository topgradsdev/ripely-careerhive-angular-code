import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  HomepageManagementComponent } from './homepage-management.component';

const routes: Routes = [

	{
		path: '',
		component: HomepageManagementComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageManagementRoutingModule { }

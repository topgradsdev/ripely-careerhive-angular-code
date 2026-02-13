import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GraduateVerificationManagementComponent } from './graduate-verification-management.component';

const routes: Routes = [
	{
		path: '',
		component: GraduateVerificationManagementComponent
	}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateVerificationManagementRoutingModule { }

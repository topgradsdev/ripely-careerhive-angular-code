import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployersListComponent } from './employers-list.component';

const routes: Routes = [
	{
		path: '',
		component: EmployersListComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployersListRoutingModule { }

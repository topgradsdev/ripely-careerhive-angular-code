import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerFaqComponent }  from './employer-faq.component';

const routes: Routes = [
	{
		path: '',
		component: EmployerFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerFaqRoutingModule { }

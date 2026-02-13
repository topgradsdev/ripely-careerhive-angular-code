import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEmployerComponent } from './view-employer.component';

const routes: Routes = [
	{
		path: '',
		component: ViewEmployerComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEmployerRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGraduateComponent } from './view-graduate.component';

const routes: Routes = [
	{
		path: '',
		component: ViewGraduateComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewGraduateRoutingModule { }

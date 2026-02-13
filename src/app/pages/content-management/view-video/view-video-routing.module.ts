import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewVideoComponent } from './view-video.component';

const routes: Routes = [
	{
		path:'',
		component: ViewVideoComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewVideoRoutingModule { }

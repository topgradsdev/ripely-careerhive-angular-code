import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVideoComponent } from './add-video.component';

const routes: Routes = [
	{
		path:'',
		component: AddVideoComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVideoRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerVideosComponent } from './career-videos.component';

const routes: Routes = [
	{
		path: '',
		component: CareerVideosComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerVideosRoutingModule { }

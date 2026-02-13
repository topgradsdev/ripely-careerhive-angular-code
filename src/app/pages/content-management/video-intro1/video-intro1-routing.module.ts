import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoIntro1Component } from './video-intro1.component';

const routes: Routes = [

	{
		path:'',
		component: VideoIntro1Component
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoIntro1RoutingModule { }

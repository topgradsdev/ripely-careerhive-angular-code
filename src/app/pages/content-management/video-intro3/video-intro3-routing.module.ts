import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoIntro3Component } from './video-intro3.component';

const routes: Routes = [

	{
		path:'',
		component: VideoIntro3Component
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoIntro3RoutingModule { }

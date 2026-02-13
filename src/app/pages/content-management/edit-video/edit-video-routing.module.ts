import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditVideoComponent } from './edit-video.component';

const routes: Routes = [
	{
		path:'',
		component: EditVideoComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditVideoRoutingModule { }

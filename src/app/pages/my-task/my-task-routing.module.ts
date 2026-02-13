import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTaskComponent } from './my-task.component';

const routes: Routes = [
  {
		path: '',
		component: MyTaskComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTaskRoutingModule { }

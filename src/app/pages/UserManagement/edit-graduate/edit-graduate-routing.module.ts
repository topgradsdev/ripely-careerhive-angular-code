import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditGraduateComponent } from './edit-graduate.component';

const routes: Routes = [
	{
		path: '',
		component: EditGraduateComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditGraduateRoutingModule { }

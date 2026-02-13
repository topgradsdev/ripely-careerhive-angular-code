import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployerComponent } from './edit-employer.component';

const routes: Routes = [
	{
		path: '',
		component: EditEmployerComponent
	}	
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEmployerRoutingModule { }

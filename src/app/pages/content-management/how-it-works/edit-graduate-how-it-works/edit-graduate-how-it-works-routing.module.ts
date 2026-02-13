import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditGraduateHowItWorksComponent } from './edit-graduate-how-it-works.component';

const routes: Routes = [

	{
		path:'',
		component:EditGraduateHowItWorksComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditGraduateHowItWorksRoutingModule { }

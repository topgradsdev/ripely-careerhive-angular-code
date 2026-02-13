import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployerHowItWorksComponent } from './edit-employer-how-it-works.component';

const routes: Routes = [

	{
		path:'',
		component:EditEmployerHowItWorksComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEmployerHowItWorksRoutingModule { }

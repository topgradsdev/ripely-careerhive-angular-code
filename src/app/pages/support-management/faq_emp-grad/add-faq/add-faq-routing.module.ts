import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFaqComponent } from './add-faq.component';

const routes: Routes = [

	{
		path:'',
		component: AddFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFaqRoutingModule { }

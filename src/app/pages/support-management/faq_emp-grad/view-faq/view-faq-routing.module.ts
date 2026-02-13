import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewFaqComponent } from './view-faq.component';

const routes: Routes = [

	{
		path:'',
		component: ViewFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFaqRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduateEditFaqComponent } from './graduate-edit-faq.component';

const routes: Routes = [
  {
		path:'',
		component: GraduateEditFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateEditFaqRoutingModule { }

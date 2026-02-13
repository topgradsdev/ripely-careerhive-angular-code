import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduateAddFaqComponent } from './graduate-add-faq.component';

const routes: Routes = [
  {
		path:'',
		component: GraduateAddFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateAddFaqRoutingModule { }

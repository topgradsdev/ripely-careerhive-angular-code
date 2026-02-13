import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduateFaqComponent } from './graduate-faq.component';

const routes: Routes = [
  {
		path: '',
		component: GraduateFaqComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateFaqRoutingModule { }

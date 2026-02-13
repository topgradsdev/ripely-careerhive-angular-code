import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsSubHeadingsComponent } from './terms-sub-headings.component';

const routes: Routes = [
  {
		path:'',
		component: TermsSubHeadingsComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsSubHeadingsRoutingModule { }

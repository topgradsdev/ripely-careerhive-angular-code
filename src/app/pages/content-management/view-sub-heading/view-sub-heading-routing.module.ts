import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSubHeadingComponent } from './view-sub-heading.component';

const routes: Routes = [
  {
		path:'',
		component: ViewSubHeadingComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewSubHeadingRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubHeadingComponent } from './add-sub-heading.component';

const routes: Routes = [
  {
    path:'',
		component: AddSubHeadingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSubHeadingRoutingModule { }

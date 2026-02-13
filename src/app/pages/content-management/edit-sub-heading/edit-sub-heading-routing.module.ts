import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSubHeadingComponent } from './edit-sub-heading.component';

const routes: Routes = [
  {
    path:'',
		component: EditSubHeadingComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSubHeadingRoutingModule { }

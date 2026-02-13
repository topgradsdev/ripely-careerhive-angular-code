import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditHeadingComponent } from './edit-heading.component';

const routes: Routes = [

  {
    path:'',
		component: EditHeadingComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditHeadingRoutingModule { }

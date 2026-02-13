import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduateListComponent } from './graduate-list.component';

const routes: Routes = [
	{
		path: '',
		component: GraduateListComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduateListRoutingModule { }

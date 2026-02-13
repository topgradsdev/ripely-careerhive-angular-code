import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedSupportComponent } from './need-support.component';

const routes: Routes = [
  {
		path: '',
		component: NeedSupportComponent
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeedSupportRoutingModule { }

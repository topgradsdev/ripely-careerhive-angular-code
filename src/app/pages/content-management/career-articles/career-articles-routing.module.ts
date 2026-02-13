import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerArticlesComponent } from './career-articles.component';

const routes: Routes = [
	{
		path: '',
		component: CareerArticlesComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerArticlesRoutingModule { }

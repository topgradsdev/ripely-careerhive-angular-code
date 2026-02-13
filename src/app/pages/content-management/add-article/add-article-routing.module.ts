import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddArticleComponent } from './add-article.component';

const routes: Routes = [

	{
		path:'',
		component: AddArticleComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddArticleRoutingModule { }

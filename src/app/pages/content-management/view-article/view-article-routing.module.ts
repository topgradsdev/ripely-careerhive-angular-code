import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewArticleComponent } from './view-article.component';

const routes: Routes = [

	{
		path:'',
		component: ViewArticleComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewArticleRoutingModule { }

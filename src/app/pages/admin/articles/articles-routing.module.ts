import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ViewArticleComponent } from './view-article/view-article.component';

const routes: Routes = [
  {
		path: '',
		component: ArticlesListComponent
	},
  {
		path: 'create-article',
		component: CreateArticleComponent
	},
	{
		path: 'view-article',
		component: ViewArticleComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }

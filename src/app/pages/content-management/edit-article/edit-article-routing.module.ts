import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditArticleComponent } from './edit-article.component';

const routes: Routes = [
	{
		path:'',
		component: EditArticleComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditArticleRoutingModule { }

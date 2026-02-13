import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewArticleComponent } from './view-article/view-article.component';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    ArticlesListComponent,
    CreateArticleComponent,
    ViewArticleComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    MaterialModule,
    ModalModule,
    NgSelectModule,
    EditorModule,
    QuillModule.forRoot(),
    SharedModule
  ]
})
export class ArticlesModule { }

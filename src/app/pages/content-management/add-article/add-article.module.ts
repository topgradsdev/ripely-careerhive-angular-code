import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddArticleRoutingModule } from './add-article-routing.module';
import { AddArticleComponent } from './add-article.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AddArticleComponent
  ],
  imports: [
    CommonModule,
    AddArticleRoutingModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    QuillModule.forRoot()
  ]
})
export class AddArticleModule { }

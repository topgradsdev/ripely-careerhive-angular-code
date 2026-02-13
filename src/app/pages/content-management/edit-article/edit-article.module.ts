import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditArticleRoutingModule } from './edit-article-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EditArticleRoutingModule,
    MatDatepickerModule
  ]
})
export class EditArticleModule { }

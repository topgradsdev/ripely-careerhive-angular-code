import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFaqRoutingModule } from './add-faq-routing.module';
import { AddFaqComponent } from './add-faq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '@coreui/angular';

@NgModule({
  declarations: [
    AddFaqComponent
  ],
  imports: [
    CommonModule,
    AddFaqRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    EditorModule,
    QuillModule.forRoot()
  ]
})
export class AddFaqModule { }

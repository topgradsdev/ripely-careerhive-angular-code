import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResumeBuilderManagementRoutingModule } from './resume-builder-management-routing.module';
import { ResumeBuilderManagementComponent } from './resume-builder-management.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    ResumeBuilderManagementComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    ResumeBuilderManagementRoutingModule,
    QuillModule.forRoot()
  ]
})
export class ResumeBuilderManagementModule { }

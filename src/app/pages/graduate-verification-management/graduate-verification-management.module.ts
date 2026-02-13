import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GraduateVerificationManagementRoutingModule } from './graduate-verification-management-routing.module';
import { GraduateVerificationManagementComponent } from './graduate-verification-management.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    GraduateVerificationManagementComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    GraduateVerificationManagementRoutingModule,
    QuillModule.forRoot()
  ]
})
export class GraduateVerificationManagementModule { }

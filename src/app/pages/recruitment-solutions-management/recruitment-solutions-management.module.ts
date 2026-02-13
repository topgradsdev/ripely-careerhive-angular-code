import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { RecruitmentSolutionsManagementRoutingModule } from './recruitment-solutions-management-routing.module';
import { RecruitmentSolutionsManagementComponent } from './recruitment-solutions-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    RecruitmentSolutionsManagementComponent
  
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    RecruitmentSolutionsManagementRoutingModule,
    QuillModule.forRoot()
  ] 
})
export class RecruitmentSolutionsManagementModule { }

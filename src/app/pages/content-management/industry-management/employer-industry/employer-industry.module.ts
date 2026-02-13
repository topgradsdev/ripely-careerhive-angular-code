

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EmployerIndustryComponent } from './employer-industry.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EmployerIndustryRoutingModule } from './employer-industry-routing.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    EmployerIndustryComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatSlideToggleModule,
    MatIconModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    EmployerIndustryRoutingModule,
    // MatFormFieldModule,
    MatPaginatorModule,
    BsDropdownModule.forRoot() ,
    ModalModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressBarModule,
    MatMenuModule,
    MatInputModule,
    QuillModule.forRoot()
  ],
providers: [BsModalRef]
})
export class EmployerIndustryModule { }



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditEmployerHowItWorksRoutingModule } from './edit-employer-how-it-works-routing.module';
import { EditEmployerHowItWorksComponent } from './edit-employer-how-it-works.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    EditEmployerHowItWorksComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatSlideToggleModule,
    MatIconModule,
    EditEmployerHowItWorksRoutingModule,NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ]
})
export class EditEmployerHowItWorksModule { }

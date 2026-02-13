import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoIntro2RoutingModule } from './video-intro2-routing.module';
import { VideoIntro2Component } from './video-intro2.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    VideoIntro2Component
  ],
  imports: [
    CommonModule,
    VideoIntro2RoutingModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    QuillModule.forRoot()
  ]
})
export class VideoIntro2Module { }

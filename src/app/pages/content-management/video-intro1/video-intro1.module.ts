import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoIntro1RoutingModule } from './video-intro1-routing.module';
import { VideoIntro1Component } from './video-intro1.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    VideoIntro1Component
  ],
  imports: [
    CommonModule,
    VideoIntro1RoutingModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    QuillModule.forRoot()
  ]
})
export class VideoIntro1Module { }

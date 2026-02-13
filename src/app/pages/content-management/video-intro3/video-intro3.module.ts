import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoIntro3RoutingModule } from './video-intro3-routing.module';
import { VideoIntro3Component } from './video-intro3.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    VideoIntro3Component
  ],
  imports: [
    CommonModule,
    VideoIntro3RoutingModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    QuillModule.forRoot()
  ]
})
export class VideoIntro3Module { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoIntroRoutingModule } from './video-intro-routing.module';
import { VideoIntroComponent } from './video-intro.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VideoIntroComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    VideoIntroRoutingModule
  ]
})
export class VideoIntroModule { }

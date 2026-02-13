import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';

import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProfileComponent } from './view-profile.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    ViewProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
    // BrowserModule
  ]
})
export class ViewProfileModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../material.module';


@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule
  ]
})
export class ChangePasswordModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRegisterRoutingModule } from './employer-register-routing.module';
import { HeaderModule } from '../../../common/header/header.module';
import { EmployerRegisterComponent } from './employer-register.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    EmployerRegisterComponent
  ],
  imports: [
    CommonModule,
    EmployerRegisterRoutingModule,
    HeaderModule,
    MaterialModule
  ]
})
export class EmployerRegisterModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacanciesRoutingModule } from './vacancies-routing.module';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    VacanciesRoutingModule,
    MaterialModule,
    SharedModule,
    ModalModule
  ]
})
export class VacanciesModule { }

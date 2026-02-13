import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacanciesDetailsRoutingModule } from './vacancies-details-routing.module';
import { VacanciesDetailsComponent } from './vacancies-details.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    VacanciesDetailsComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    ModalModule,
    QuillModule,
    VacanciesDetailsRoutingModule,
    MaterialModule,
    FormsModule,
  ]
})
export class VacanciesDetailsModule { }

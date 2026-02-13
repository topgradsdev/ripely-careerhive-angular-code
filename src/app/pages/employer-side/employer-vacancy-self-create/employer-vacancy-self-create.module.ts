import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerVacancySelfCreateRoutingModule } from './employer-vacancy-self-create-routing.module';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EmployerVacancySelfCreateRoutingModule,
    MaterialModule,
    NgSelectModule,
    EditorModule,
    // GooglePlaceModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot()
  ]
})
export class EmployerVacancySelCreateModule { }

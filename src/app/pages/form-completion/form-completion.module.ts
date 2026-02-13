import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormCompletionRoutingModule } from './form-completion-routing.module';
import { MaterialModule } from '../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewProfileModule } from '../view-profile/view-profile.module';
import { SharedModule } from '../../shared/shared.module';
import { VacancyFilterPipe } from '../../../pipes/vacancy-search-pipe';
import { ChangePasswordModule } from '../change-password/change-password.module';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormCompletionComponent } from './form/form-completion.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FormCompletionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormCompletionRoutingModule,
    MaterialModule,
    NgSelectModule,
    ViewProfileModule,
    // GooglePlaceModule,
    EditorModule,
    SharedModule,
    ModalModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot()
  ]
})
export class FormCompletionModule { }

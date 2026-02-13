import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EmployerProjectCreateRoutingModule } from './employer-create-project-routing.module';
import { EmployerProjectCreateComponent } from './employer-create-project.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    EmployerProjectCreateComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    EmployerProjectCreateRoutingModule,
    MaterialModule,
    NgSelectModule,
    EditorModule,
    // GooglePlaceModule,
    ModalModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot()
  ]
})
export class EmployerProjectCreateModule { }

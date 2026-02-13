import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerJobPostRoutingModule } from './employer-job-post.routing.module';
import { EmployerJobPostComponent } from './employer-job-post.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from '../../../material.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [EmployerJobPostComponent],
  imports: [
    CommonModule,
    EmployerJobPostRoutingModule,
    MaterialModule,
    // GooglePlaceModule,
    NgSelectModule,
    EditorModule,
    QuillModule.forRoot()
  ]
})
export class EmployerJobPostModule { }

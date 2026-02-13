import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderListComponent } from './form-builder-list/form-builder-list.component';
import { MaterialModule } from '../../material.module';
import { SinglePageFormComponent } from './single-page-form/single-page-form.component';
// import { NgDragDropModule } from 'ng-drag-drop';
import { MultilineFieldComponent } from './elements/multiline-field/multiline-field.component';
import { SinglelineFieldComponent } from './elements/singleline-field/singleline-field.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumberFieldComponent } from './elements/number-field/number-field.component';
import { DateFieldComponent } from './elements/date-field/date-field.component';
import { TimeFieldComponent } from './elements/time-field/time-field.component';
import { YesNoFieldComponent } from './elements/yes-no-field/yes-no-field.component';
import { LikertScaleFieldComponent } from './elements/likert-scale-field/likert-scale-field.component';
import { DndModule } from 'ngx-drag-drop';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropdownFieldComponent } from './elements/dropdown-field/dropdown-field.component';
import { CheckboxFieldComponent } from './elements/checkbox-field/checkbox-field.component';
import { RadioFieldComponent } from './elements/radio-field/radio-field.component';
import { ChipsFieldComponent } from './elements/chips-field/chips-field.component';
import { MultiStepFormComponent } from './multi-step-form/multi-step-form.component';
import { AttachmentsFieldComponent } from './elements/attachments-field/attachments-field.component';
import { ImageFieldComponent } from './elements/image-field/image-field.component';
import { PreviewSingleFormComponent } from './preview-single-form/preview-single-form.component';
import { SearchPipe } from '../../../pipes/search.pipe';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewMultiFormComponent } from './preview-multi-form/preview-multi-form.component';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilderComponent } from './form-builder.component';
import { SignatureFieldComponent } from './elements/signature-field/signature-field.component';
import { SubmitedFormListComponent } from './submited-form-list/submited-form-list.component';
import { DescriptionFieldComponent } from './elements/description-field/description-field.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DownloadableContentComponent } from './elements/downloadable-content/downloadable-content.component';
import { QuillModule } from 'ngx-quill';
import { ConditionalLogicListComponent } from './conditional-logic-list/conditional-logic-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    FormBuilderListComponent,
    SinglePageFormComponent,
    MultilineFieldComponent,
    DescriptionFieldComponent,
    SinglelineFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    TimeFieldComponent,
    YesNoFieldComponent,
    LikertScaleFieldComponent,
    DropdownFieldComponent,
    CheckboxFieldComponent,
    RadioFieldComponent,
    ChipsFieldComponent,
    MultiStepFormComponent,
    AttachmentsFieldComponent,
    ImageFieldComponent,
    PreviewSingleFormComponent,
    SearchPipe,
    PreviewMultiFormComponent,
    FormBuilderComponent,
    SignatureFieldComponent,
    SubmitedFormListComponent,
    DownloadableContentComponent,
    ConditionalLogicListComponent
  ],
  imports: [
    InfiniteScrollModule,
    SharedModule,
    QuillModule,
    CommonModule,
    FormBuilderRoutingModule,
    MaterialModule,
    ModalModule,
    NgSelectModule,
    DndModule,
    DragDropModule,
    NgxMaterialTimepickerModule,
    ModalModule,
    NgxPermissionsModule.forChild()
  ]
})
export class FormBuilderModule { }

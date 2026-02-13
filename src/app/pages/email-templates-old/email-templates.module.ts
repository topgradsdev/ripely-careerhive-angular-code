import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailTemplatesRoutingModule } from './email-templates-routing.module';
import { EmailTemplatesListComponent } from './email-templates-list/email-templates-list.component';
import { MaterialModule } from '../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlainTextEmailComponent } from './plain-text-email/plain-text-email.component';
import { HtmlEmailComponent } from './html-email/html-email.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ImageComponent } from './elements/image/image.component';
import { EmailTemplateButtonComponent } from './elements/email-template-button/email-template-button.component';
import { EmailTemplateDividerComponent } from './elements/email-template-divider/email-template-divider.component';
import { EmailTemplateSocialLinkComponent } from './elements/email-template-social-link/email-template-social-link.component';
import { BlankSectionComponent } from './elements/blank-section/blank-section.component';
import { TwoColumnSectionComponent } from './elements/two-column-section/two-column-section.component';
import { ThreeColumnSectionComponent } from './elements/three-column-section/three-column-section.component';

import { LogoComponent } from './elements/logo/logo.component';
import { TextComponent } from './elements/text/text.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HtmlEmailPreviewComponent } from './html-email-preview/html-email-preview.component';
import { EmailSentListComponent } from './email-sent-list/email-sent-list.component';
import { EmailPreviewHtmlComponent } from './email-preview-html/email-preview-html.component';
import { QuillModule } from 'ngx-quill';
import { EmailTemplateAttachmentComponent } from './elements/email-template-attachment/email-template-attachment.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SearchPipe } from '../../../pipes/search.pipe';
import { DndModule } from 'ngx-drag-drop';


@NgModule({
  declarations: [
    EmailTemplatesListComponent,
    PlainTextEmailComponent,
    HtmlEmailComponent,
    ImageComponent,
    EmailTemplateButtonComponent,
    EmailTemplateDividerComponent,
    EmailTemplateAttachmentComponent,
    EmailTemplateSocialLinkComponent,
    BlankSectionComponent,
    TwoColumnSectionComponent,
    ThreeColumnSectionComponent,
    LogoComponent,
    TextComponent,
    HtmlEmailPreviewComponent,
    EmailSentListComponent,
    EmailPreviewHtmlComponent,


    // SearchPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailTemplatesRoutingModule,
    MaterialModule,
    NgSelectModule,
    EditorModule,
    ModalModule,
    SharedModule,
    DndModule,
    // NgDragDropModule.forRoot(),
    DragDropModule,
    QuillModule.forRoot(),
    NgxPermissionsModule.forChild()
  ]
})
export class EmailTemplatesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemRoutingModule } from './system-routing.module';
import { AIAgentComponent } from './agent/ai-agent.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SendEmailPopupComponent } from '../../shared/components/components';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgChartsModule } from 'ng2-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AddAIAgentComponent } from './add-agent/add-ai-agent.component';
import { AddKnowledgeBaseComponent } from './add-knowledge-base/add-knowledge-base.component';

@NgModule({
  declarations: [
    AIAgentComponent,
    AddAIAgentComponent,
    AddKnowledgeBaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemRoutingModule,
    MatIconModule,
    MatMenuModule,
    NgChartsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgSelectModule,
    EditorModule,
    MatRadioModule,
    DragDropModule,
    NgxMaterialTimepickerModule,
    MaterialModule,
    SharedModule,
    ModalModule,
    QuillModule.forRoot(),
    NgxPermissionsModule.forChild()
  ]
})
export class SystemModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRuleRoutingModule } from './system-rule-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DndModule } from 'ngx-drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuillModule } from 'ngx-quill';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SystemRuleListComponent } from './system-rule-list/system-rule-list.component';
import { SystemRuleDetailComponent } from './system-rule-details/system-rule-details.component';
import { AddSystemRuleComponent } from './add-system-rule/add-system-rule.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    SystemRuleListComponent,
    SystemRuleDetailComponent,
    AddSystemRuleComponent
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    // ChartsModule,
    SystemRuleRoutingModule,
    CommonModule,
    NgSelectModule,
    EditorModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    DragDropModule,
    // PerfectScrollbarModule,
    CarouselModule,
    DndModule,
    // NgDragDropModule.forRoot(),
    // GooglePlaceModule,
    MatTabsModule,
    ModalModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot(),
    MatSelectModule,
    MatOptionModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [
    BsModalService,
  ],
})
export class SystemRuleModule { }

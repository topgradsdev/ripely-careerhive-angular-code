
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { ChartsModule } from 'ng2-charts';
import { MyProjectDetailsComponent } from './my-project-details.component';
import { MyProjectRoutingModule } from '../my-project/my-project-routing.module';
import { PrePlacementTabProjectComponent } from './pre-placement-tab-project/pre-placement-tab-project.component';
import { OngoingTabProjectComponent } from './ongoing-tab-project/ongoing-tab-project.component';
import { CompletedTabProjectComponent } from './completed-tab-project/completed-tab-project.component';
import { PostPlacementTabProjectComponent } from './post-placement-tab-project/post-placement-tab-project.component';
import { DownloadTabProjectComponent } from './download-tab-project/download-tab-project.component';



@NgModule({
  declarations: [
    MyProjectDetailsComponent,
    PrePlacementTabProjectComponent,
    OngoingTabProjectComponent,
    CompletedTabProjectComponent,
    PostPlacementTabProjectComponent,
    DownloadTabProjectComponent
  ],
  imports: [
    CommonModule,
    MyProjectRoutingModule,
    MaterialModule,
    SharedModule,
    // ChartsModule
  ],
  exports:[
    PrePlacementTabProjectComponent,
    OngoingTabProjectComponent,
    CompletedTabProjectComponent,
    PostPlacementTabProjectComponent,
    DownloadTabProjectComponent
  ]
})
export class MyProjectDetailsModule { }

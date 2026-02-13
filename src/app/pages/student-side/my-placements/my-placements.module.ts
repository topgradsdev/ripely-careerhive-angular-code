import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPlacementsRoutingModule } from './my-placements-routing.module';
import { PrePlacementTabComponent } from './pre-placement-tab/pre-placement-tab.component';
import { MaterialModule } from '../../../material.module';
import { OngoingTabComponent } from './ongoing-tab/ongoing-tab.component';
import { CompletedTabComponent } from './completed-tab/completed-tab.component';
import { PostPlacementTabComponent } from './post-placement-tab/post-placement-tab.component';
import { YoutubeVimeoUrlValidatorDirective } from 'src/app/youtube-vimeo-url.directive';
import { OnboradingCompanyComponent } from '../onborading-company/onborading-company.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    PrePlacementTabComponent,
    OngoingTabComponent,
    CompletedTabComponent,
    PostPlacementTabComponent,
    // YoutubeVimeoUrlValidatorDirective,
    // OnboradingCompanyComponent
  ],
  imports: [
    CommonModule,
    MyPlacementsRoutingModule,
    MaterialModule,
    SharedModule,
    NgSelectModule,
    ModalModule
    // ChartsModule
  ],
  exports: [
    PrePlacementTabComponent,
    OngoingTabComponent,
    CompletedTabComponent,
    PostPlacementTabComponent
  ]
})
export class MyPlacementsModule { }

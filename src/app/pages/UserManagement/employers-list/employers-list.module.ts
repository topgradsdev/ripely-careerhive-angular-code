import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployersListComponent } from './employers-list.component';

import { EmployersListRoutingModule } from './employers-list-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatButtonModule} from '@angular/material/button';
// import { NgxStarRatingModule } from 'ngx-star-rating';
@NgModule({
  declarations: [
    EmployersListComponent
  ],
  imports: [
    // NgxStarRatingModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    ModalModule,
    BsDropdownModule.forRoot() ,
    EmployersListRoutingModule,
    CommonModule,
    MatProgressBarModule
  ],
  providers: [BsModalRef]
})
export class EmployersListModule { }

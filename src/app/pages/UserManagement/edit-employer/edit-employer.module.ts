import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEmployerRoutingModule } from './edit-employer-routing.module';
import { EditEmployerComponent } from './edit-employer.component';
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
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    EditEmployerComponent
  ],
  imports: [
    CommonModule,
    EditEmployerRoutingModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    ModalModule,
    MatButtonModule,
    BsDropdownModule.forRoot() ,

  ],
  providers: [BsModalRef]
})
export class EditEmployerModule { }

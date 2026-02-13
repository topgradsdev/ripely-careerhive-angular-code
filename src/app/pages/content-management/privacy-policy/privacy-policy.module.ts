import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
//import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    ModalModule,
    BsDropdownModule.forRoot() ,
  //  FormsModule,ReactiveFormsModule,
    PrivacyPolicyRoutingModule
  ],
  providers: [
    BsModalRef
  ]
})
export class PrivacyPolicyModule { }

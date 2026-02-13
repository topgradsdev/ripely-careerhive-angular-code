import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraduateFaqRoutingModule } from './graduate-faq-routing.module';
import { GraduateFaqComponent } from './graduate-faq.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '@coreui/angular';
// import { Injectable, Pipe, PipeTransform } from '@angular/core';



// @Pipe({
//   name: 'fieldSum',
//   pure: false
// })
// @Injectable()
// export class FieldSumPipe implements PipeTransform {
//   transform(items: any[], attr: string): number {
//     return items.reduce((a, b) => a + b[attr], 0);
//   }
// }

@NgModule({
  declarations: [
    GraduateFaqComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraduateFaqRoutingModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    ModalModule,
    BsDropdownModule.forRoot() 
  ],
  providers :[
    BsModalRef
  ]
})
export class GraduateFaqModule { }

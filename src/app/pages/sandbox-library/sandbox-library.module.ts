import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SandboxLibraryRoutingModule } from './sandbox-library-routing.module';
import { SandboxListComponent } from './sandbox-list/sandbox-list.component';
import { CreateSandboxComponent } from './create-sandbox/create-sandbox.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    SandboxListComponent,
    CreateSandboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SandboxLibraryRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    NgSelectModule,
    MaterialModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ]
})
export class SandboxLibraryModule { }

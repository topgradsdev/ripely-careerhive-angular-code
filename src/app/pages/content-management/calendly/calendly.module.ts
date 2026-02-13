import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendlyRoutingModule } from './calendly-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CalendlyComponent } from './calendly.component';



@NgModule({
  declarations: [CalendlyComponent],
  imports: [
    CommonModule,
    CalendlyRoutingModule,
    MatTableModule,
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
    MatProgressBarModule
  ]
})
export class CalendlyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentNavbarComponent } from './navbar.component';

@NgModule({
  declarations: [StudentNavbarComponent],
  imports: [CommonModule, RouterModule],
  exports: [StudentNavbarComponent]
})
export class StudentNavbarModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { StudentLoginCallBackComponent } from './student-login-callback/student-login-callback.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    // StudentLoginCallBackComponent,
    // LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgxPermissionsModule.forChild()
  ],
})
export class AuthLoginModule { }

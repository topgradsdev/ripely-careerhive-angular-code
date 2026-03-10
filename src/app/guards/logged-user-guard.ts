import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TopgradserviceService } from '../topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserGuard implements CanActivate {

  constructor(private service: TopgradserviceService, private router: Router){
    
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   const userDetail = JSON.parse(localStorage.getItem("userDetail"));

  //   if(this.service.getToken()){
  //       if(userDetail?.role == 'admin'){
  //         this.router.navigate(['admin/my-task'])
  //       } else if(userDetail?.role == 'student'){
  //         this.router.navigate(['student/dashboard'])
  //       } else if(userDetail?.role == 'staff'){
  //           this.router.navigate(['staff/my-task'])
  //       } else if(userDetail?.role == 'employee'){
  //         this.router.navigate(['employer/vacancies'])
  //       }
  //       return false
  //     } else {
  //       alert("ddd")
  //       return true;
  //     }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));
    const userSDetail = JSON.parse(localStorage.getItem("userSDetail"));

    // console.log("state.url", state.url)
    // ✅ Allow login/callback to always activate
    if (state.url.startsWith('/login/callback')) {
      return true;
    }

    if (this.service.getToken()) {
      if (userSDetail?.role === 'student') {
        this.router.navigate(['student-portal/dashboard']);
      }else if (userDetail?.role === 'admin') {
        this.router.navigate(['admin/my-task']);
      } else if (userDetail?.role === 'staff') {
        this.router.navigate(['staff/my-task']);
      } else if (userDetail?.role === 'employee') {
        this.router.navigate(['employer/vacancies']);
      }
      return false;
    } else {
      return true; // no token → allow login route
    }
  }




  
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TopgradserviceService } from '../topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuard implements CanActivate {

  constructor(private service: TopgradserviceService, private router: Router){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = JSON.parse(localStorage.getItem("userDetail"))?.role;
    if(!this.service.getToken() || role != "employee") {
      // this.service.showMessage({
      //   message: "Please Login First"
      // })
      this.router.navigate(['/employer-login']);
      return false;
    }
    else{
      // if(!JSON.parse(localStorage.getItem("userDetail"))?.company_profile) {
      //   this.router.navigate(['employer/onboarding']);
      // }
      return true;
    }
  }



  
}

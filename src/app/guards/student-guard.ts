import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TopgradserviceService } from '../topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(private service: TopgradserviceService, private router: Router){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = JSON.parse(localStorage.getItem("userSDetail"))?.role;
    if(!this.service.getToken() || role != "student") {
      // this.service.showMessage({
      //   message: "Please Login First"
      // })
      // alert("calling")
      this.router.navigate(['/student-login']);
      return false;
    }
    else{
      return true;
    }
  }



  
}

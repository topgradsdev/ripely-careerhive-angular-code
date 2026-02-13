import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-default-layout',
  templateUrl: './employee-default-layout.component.html',
  styleUrls: ['./employee-default-layout.component.scss']
})
export class EmployeeDefaultLayoutComponent implements OnInit {
  currentPage = "";
  constructor(private router: Router) { }
  userProfile:any;
  ngOnInit(): void {
      this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    if(this.userProfile?.change_password){
      this.router.navigate(['employer/change-password']);
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-default-layout',
  templateUrl: './login-default-layout.component.html',
  styleUrls: ['./login-default-layout.component.scss']
})
export class LoginDefaultLayoutComponent implements OnInit {
  currentPage :any= "";
  constructor() { }

  ngOnInit(): void {
  }

}

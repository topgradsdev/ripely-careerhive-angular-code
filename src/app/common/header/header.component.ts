import { Component, Input, OnInit } from '@angular/core';
import { ClassToggleService } from '@coreui/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
@Input() sidebarId: string = "sidebar";
constructor(private classToggler: ClassToggleService) {
    // super();
  }

  ngOnInit(): void {
  }

}

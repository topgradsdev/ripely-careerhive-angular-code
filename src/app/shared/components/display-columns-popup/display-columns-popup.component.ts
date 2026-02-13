import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-columns-popup',
  templateUrl: './display-columns-popup.component.html',
  styleUrls: ['./display-columns-popup.component.scss']
})
export class DisplayColumnsPopupComponent implements OnInit {
  @Input() modalId: string;
  constructor() { }

  ngOnInit(): void {
  }

  applyShowHideColumnFilter(){
    
  }
}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-event-bright',
  templateUrl: './event-bright.component.html',
  styleUrls: ['./event-bright.component.scss']
})
export class EventBrightComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}

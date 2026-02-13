import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-terms-and-conditions',
  templateUrl: './student-terms-and-conditions.component.html',
  styleUrls: ['./student-terms-and-conditions.component.scss']
})
export class StudentTermsAndConditionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scrollToMessage(messageId: any) {
    // inside ngAfterViewInit() to make sure the list items render or inside ngAfterViewChecked() if you are anticipating live data using @Inputs
    const messageToScrollTo = document.getElementById(messageId)
    // null check to ensure that the element actually exists
    if (messageToScrollTo) {
      messageToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

}

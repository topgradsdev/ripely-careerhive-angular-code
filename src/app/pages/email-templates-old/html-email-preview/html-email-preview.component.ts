import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-html-email-preview',
  templateUrl: './html-email-preview.component.html',
  styleUrls: ['./html-email-preview.component.scss']
})
export class HtmlEmailPreviewComponent implements OnInit {
  @Input() emailTemplateData: any;
  DOMAIN_URL = environment.domain;
  constructor() { }

  ngOnInit(): void {
    console.log("emailTemplateData", this.emailTemplateData);
  }



  openLink(link) {
    const lk = link?.document || link?.url;
    if (lk) {
      var win = window.open();
      win.document.write('<iframe src="' + lk + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    }
  }

}

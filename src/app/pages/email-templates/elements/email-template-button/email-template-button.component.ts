import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-email-template-button',
  templateUrl: './email-template-button.component.html',
  styleUrls: ['./email-template-button.component.scss']
})
export class EmailTemplateButtonComponent implements OnInit {
  @Input() data: any;
  selected = false;
  selectedIndex = 1;
  selectedFile: any;
  @Output() action = new EventEmitter();
  element: any = {
    editButton: {
      fill: "#464ba8",
      borderRadius: {
        topLeft: 25,
        topRight: 25,
        bottomLeft: 25,
        bottomRight: 25,
      },
      transparency: 100,
      width: 100,
      fontFamily: 'Arial',
      bold: false,
      italic: false,
      underline: false,
      fontSize: 16,
      color: "#ffffff",
      textAlign: 'center',
      label: "Button"
    },
    link: {
      url: '',
      document: null,
      email: ''
    }
  }

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (Object.keys(this.data?.elementData).length > 1) {
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
    }
  }
  btnTabs(index: number) {
    this.selectedIndex = index;
  }
  toggleElement() {
    if (this.data.elementData.insideSection) {
      return;
    }
    this.selected = !this.selected;
  }

  deleteElement() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  copyElement() {
    this.data.actionType = 'copy';
    this.action.emit(this.data);
  }

  getFile(event) {
    const self = this;
      const files = event.target.files[0];
      if (files) {
        self.selectedFile = files;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
          const result: any = this.result;
         self.element.link.document = result;
        });    
      }
      // event.target.value = ''
  }

  openLink() {
    const link = this.data?.elementData?.link?.document || this.data?.elementData?.link?.url
    if (link) {
      var win = window.open();
      win.document.write('<iframe src="' + link + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    }
  }

  save() {
    this.element.insideSection = this.data.elementData.insideSection;
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

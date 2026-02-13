import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-email-template-divider',
  templateUrl: './email-template-divider.component.html',
  styleUrls: ['./email-template-divider.component.scss']
})
export class EmailTemplateDividerComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @Output() action = new EventEmitter();
  element: any = {
    style: 'solid',
    color: "#000000",
    transparency: 100,
    width: 1,
    sameWidthAsSection: false
  }
  constructor() { }

  ngOnInit(): void {
    if (Object.keys(this.data?.elementData).length > 1) {
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
    }
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

  save() {
    this.element.insideSection = this.data.elementData.insideSection;
   this.element.width = (this.element.sameWidthAsSection ? '1' : this.element.width);
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

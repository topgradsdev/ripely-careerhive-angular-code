import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-blank-section',
  templateUrl: './blank-section.component.html',
  styleUrls: ['./blank-section.component.scss']
})
export class BlankSectionComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @ViewChild('blankSection', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
  @Output() action = new EventEmitter();
  element = {
    width: 100,
    margin: 0,
    padding: 0
  }
  

  constructor(private cfr: ComponentFactoryResolver) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.data?.actionType === 'sort') {
        const obj = { dragData: this.data?.droppedSectionItems.blankSections[0]?.instance.data };
        this.data.droppedSectionItems.blankSections = [];
        this.onBlankSectionElementDrop(obj, 'sort');
      }
    }, 100);
  }

  onBlankSectionElementDrop(e: any, type?) {
    if (this.data.droppedSectionItems.blankSections.length >= 1) {
      return;
    }
    const componentFactory = this.cfr.resolveComponentFactory(e.dragData.component);
    const componentRef: any = this.viewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, e.dragData);
      obj.index = this.data.index;
      componentRef.instance.data = obj;
    } else {
      componentRef.instance.data = {
        id: e.dragData.id,
        index: this.data.index,
        name: e.dragData.name,
        component: e.dragData.component,
        actionType: "",
        elementData: {
          insideSection: true
        }
      };
    }

    this.data.droppedSectionItems.blankSections.push(componentRef);
  }

  deleteSection() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  copySection() {
    this.data.actionType = 'copy';
    this.action.emit(this.data);
  }

  save() {
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

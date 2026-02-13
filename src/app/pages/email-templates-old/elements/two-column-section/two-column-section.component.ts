import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-two-column-section',
  templateUrl: './two-column-section.component.html',
  styleUrls: ['./two-column-section.component.scss']
})
export class TwoColumnSectionComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @ViewChild('firstSection', { read: ViewContainerRef }) private firstSectionViewRef: ViewContainerRef;
  @ViewChild('secondSection', { read: ViewContainerRef }) private secondSectionViewRef: ViewContainerRef;

  @Output() action = new EventEmitter();
  element = {
    sectionOne: {
      width: 100,
      padding: 0,
      margin: 0
    },
    sectionTwo: {
      width: 100,
      padding: 0,
      margin: 0
    },
    one: true,
    two: false,
    spacing: 0,
  }

  constructor(private cfr: ComponentFactoryResolver) {
   }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.data?.actionType === 'sort') {
        if (this.data?.droppedSectionItems.twoSections.firstSection.length > 0) {
          const obj = { dragData: this.data?.droppedSectionItems.twoSections.firstSection[0].instance.data };
          this.data.droppedSectionItems.twoSections.firstSection = [];
          this.onFirstSectionElementDrop(obj, 'sort');
        }
        if (this.data?.droppedSectionItems.twoSections.secondSection.length > 0) {
          const obj = { dragData: this.data?.droppedSectionItems.twoSections.secondSection[0].instance.data };
          this.data.droppedSectionItems.twoSections.secondSection = [];
          this.onSecondSectionElementDrop(obj, 'sort');
        } 
      }
    }, 100);
  }

  onFirstSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.twoSections.firstSection.length >= 1) {
      return;
    }
    const componentFactory = this.cfr.resolveComponentFactory(e.dragData.component);
    const componentRef: any = this.firstSectionViewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, e.dragData);
      obj.index = 'firstSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
      componentRef.instance.data = {
        id: e.dragData.id,
        index: 'firstSection' + this.data.index,
        name: e.dragData.name,
        component: e.dragData.component,
        actionType: "",
        elementData: {
          insideSection: true
        }
      };
    }
    this.data?.droppedSectionItems.twoSections.firstSection.push(componentRef);
  }

  onSecondSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.twoSections.secondSection.length >= 1) {
      return;
    }
    const componentFactory = this.cfr.resolveComponentFactory(e.dragData.component);
    const componentRef: any = this.secondSectionViewRef.createComponent(componentFactory);
    
    if (type === 'sort') {
      const obj = Object.assign({}, e.dragData);
      obj.index = 'secondSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
      componentRef.instance.data = {
        id: e.dragData.id,
        index: 'secondSection' + this.data.index,
        name: e.dragData.name,
        component: e.dragData.component,
        actionType: "",
        elementData: {
          insideSection: true
        }
      };
    }

    this.data?.droppedSectionItems.twoSections.secondSection.push(componentRef);
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
    this.data.elementData = {
      sectionOne: {
        width: this.element.sectionOne.width + "%",
        padding: this.element.sectionOne.padding + "px",
        margin: this.element.sectionOne.margin + "px"
      },
      sectionTwo: {
        width: this.element.sectionTwo.width + "%",
        padding: this.element.sectionTwo.padding + "px",
        margin: this.element.sectionTwo.margin + "px"
      },
      spacing: this.element.spacing + "px",
    };
    this.action.emit(this.data);
  }
}

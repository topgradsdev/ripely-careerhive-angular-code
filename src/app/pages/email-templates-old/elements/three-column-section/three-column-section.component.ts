import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-three-column-section',
  templateUrl: './three-column-section.component.html',
  styleUrls: ['./three-column-section.component.scss']
})
export class ThreeColumnSectionComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @ViewChild('firstSection', { read: ViewContainerRef }) private firstSectionViewRef: ViewContainerRef;
  @ViewChild('secondSection', { read: ViewContainerRef }) private secondSectionViewRef: ViewContainerRef;
  @ViewChild('thirdSection', { read: ViewContainerRef }) private thirdSectionViewRef: ViewContainerRef;

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
    sectionThree: {
      width: 100,
      padding: 0,
      margin: 0
    },
    one: true,
    two: false,
    three: false,
    spacing: 0,
  }

  constructor(private cfr: ComponentFactoryResolver) {
    
   }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.data?.actionType === 'sort') {
        if (this.data?.droppedSectionItems.threeSections.firstSection.length > 0) {
          const obj = { dragData: this.data?.droppedSectionItems.threeSections.firstSection[0].instance.data };
          this.data.droppedSectionItems.threeSections.firstSection = [];
          this.onFirstSectionElementDrop(obj, 'sort');
        }
        if (this.data?.droppedSectionItems.threeSections.secondSection.length > 0) {
          const obj = { dragData: this.data?.droppedSectionItems.threeSections.secondSection[0].instance.data };
          this.data.droppedSectionItems.threeSections.secondSection = [];
          this.onSecondSectionElementDrop(obj, 'sort');
        } 
        if (this.data?.droppedSectionItems.threeSections.thirdSection.length > 0) {
          const obj = { dragData: this.data?.droppedSectionItems.threeSections.thirdSection[0].instance.data };
          this.data.droppedSectionItems.threeSections.thirdSection = [];
          this.onThirdSectionElementDrop(obj, 'sort');
        } 
      }
    }, 100);
  }

  onFirstSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.threeSections.firstSection.length >= 1) {
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

    this.data?.droppedSectionItems.threeSections.firstSection.push(componentRef);
  }

  onSecondSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.threeSections.secondSection.length >= 1) {
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

    this.data?.droppedSectionItems.threeSections.secondSection.push(componentRef);
  }

  onThirdSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.threeSections.thirdSection.length >= 1) {
      return;
    }
    const componentFactory = this.cfr.resolveComponentFactory(e.dragData.component);
    const componentRef: any = this.thirdSectionViewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, e.dragData);
      obj.index = 'thirdSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
    componentRef.instance.data = {
      id: e.dragData.id,
      index: 'thirdSection' + this.data.index,
      name: e.dragData.name,
      component: e.dragData.component,
      actionType: "",
      elementData: {
        insideSection: true
      }
    };
  }

    this.data?.droppedSectionItems.threeSections.thirdSection.push(componentRef);
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
      sectionThree: {
        width: this.element.sectionThree.width + "%",
        padding: this.element.sectionThree.padding + "px",
        margin: this.element.sectionThree.margin + "px"
      },
      spacing: this.element.spacing + "px",
    };
    this.action.emit(this.data);
  }
}

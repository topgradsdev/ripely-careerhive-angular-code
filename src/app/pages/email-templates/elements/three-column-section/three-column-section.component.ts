import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { TwoColumnSectionComponent } from '../two-column-section/two-column-section.component';
import { TextComponent } from '../text/text.component';
import { ImageComponent } from '../image/image.component';
import { LogoComponent } from '../logo/logo.component';
import { EmailTemplateButtonComponent } from '../email-template-button/email-template-button.component';
import { EmailTemplateSocialLinkComponent } from '../email-template-social-link/email-template-social-link.component';
import { EmailTemplateDividerComponent } from '../email-template-divider/email-template-divider.component';
import { EmailTemplateAttachmentComponent } from '../email-template-attachment/email-template-attachment.component';
import { BlankSectionComponent } from '../blank-section/blank-section.component';
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
 draggableEmailTemplateElements = [
    {
      element: 'Section',
      items: [
        { id: 'blank', name: 'Blank Section', icon: 'blank-section', type: 'blank-section', component: BlankSectionComponent },
        { id: 'two', name: '2 Column Section', icon: 'two-column-section', type: 'two-section', component: TwoColumnSectionComponent },
        { id: 'three', name: '3 Column Section', icon: 'three-column-section', type: 'three-section', component: ThreeColumnSectionComponent }
      ]
    },
    {
      element: 'Content',
      items: [
        { id: 'text', name: 'Text', icon: 'single-line', type: 'text', component: TextComponent },
        { id: 'image', name: 'Image', icon: 'image', type: 'image', component: ImageComponent },
        { id: 'logo', name: 'Logo', icon: 'logo', type: 'logo', component: LogoComponent },
        { id: 'button', name: 'Button', icon: 'button', type: 'button', component: EmailTemplateButtonComponent },
        { id: 'social_link', name: 'Social Links', icon: 'social-link', type: 'social', component: EmailTemplateSocialLinkComponent },
        { id: 'divider', name: 'Divider', icon: 'divider', type: 'divider', component: EmailTemplateDividerComponent },
        { id: 'attachment', name: 'Attachment', icon: 'attachment', type: 'attachment', component: EmailTemplateAttachmentComponent }
      ]
    }
  ];
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
      const threeSections = this.data?.droppedSectionItems?.threeSections;

      // Handle first section
      const firstInstance = threeSections?.firstSection?.[0]?.instance;
      if (firstInstance) {
        const obj = {
          data: firstInstance.data,
          m: firstInstance.data?.m ?? this.data.m,
          i: firstInstance.data?.i ?? this.data.i
        };

        console.log("First Section Drop Obj:", obj);

        this.data.droppedSectionItems.threeSections.firstSection = [];

        this.onFirstSectionElementDrop({ data: obj }, 'sort');
      }

      // Handle second section
      const secondInstance = threeSections?.secondSection?.[0]?.instance;
      if (secondInstance) {
        const obj = {
          data: secondInstance.data,
          m: secondInstance.data?.m ?? this.data.m,
          i: secondInstance.data?.i ?? this.data.i
        };

        console.log("Second Section Drop Obj:", obj);

        this.data.droppedSectionItems.threeSections.secondSection = [];

        this.onSecondSectionElementDrop({ data: obj }, 'sort');
      }

      // Handle third section
      const thirdInstance = threeSections?.thirdSection?.[0]?.instance;
      if (thirdInstance) {
        const obj = {
          data: thirdInstance.data,
          m: thirdInstance.data?.m ?? this.data.m,
          i: thirdInstance.data?.i ?? this.data.i
        };

        console.log("Third Section Drop Obj:", obj);

        this.data.droppedSectionItems.threeSections.thirdSection = [];

        this.onThirdSectionElementDrop({ data: obj }, 'sort');
      }
    }
  }, 100);
}

  onFirstSectionElementDrop(e: any, type?) {
    if (this.data?.droppedSectionItems.threeSections.firstSection.length >= 1) {
      return;
    }
    let dragged = e?.data;
   
    console.log("dragged", dragged);
    let component:any = this.draggableEmailTemplateElements[dragged.m].items[dragged.i].component;
    console.log("component", component);
      dragged['component'] = component
      let maindata = {
        ...dragged.data,
        component:component,
        m:dragged.m,
        i:dragged.i,
      }
    if (['blank-section', 'two-section', 'three-section'].includes(dragged.data.type)) {
      return false;
    }
    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef: any = this.firstSectionViewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, maindata);
      obj.index = 'firstSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
    componentRef.instance.data = {
      id: maindata.id,
      index: 'firstSection' + this.data.index,
      name: maindata.name,
      component: maindata.component,
      m:dragged.m,
      i:dragged.i,
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
       let dragged = e?.data;
   
    console.log("dragged", dragged);
    let component:any = this.draggableEmailTemplateElements[dragged.m].items[dragged.i].component;
    console.log("component", component);
      dragged['component'] = component
      let maindata = {
        ...dragged.data,
        component:component,
        m:dragged.m,
        i:dragged.i,
      }
    if (['blank-section', 'two-section', 'three-section'].includes(dragged.data.type)) {
      return false;
    }
    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef: any = this.secondSectionViewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, maindata);
      obj.index = 'secondSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
    componentRef.instance.data = {
      id: maindata.id,
      index: 'secondSection' + this.data.index,
      name: maindata.name,
      component: maindata.component,
      actionType: "",
      m:dragged.m,
        i:dragged.i,
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
       let dragged = e?.data;
   
    console.log("dragged", dragged);
    let component:any = this.draggableEmailTemplateElements[dragged.m].items[dragged.i].component;
    console.log("component", component);
      dragged['component'] = component
      let maindata = {
        ...dragged.data,
        component:component,
        m:dragged.m,
        i:dragged.i,
      }
    if (['blank-section', 'two-section', 'three-section'].includes(dragged.data.type)) {
      return false;
    }
    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef: any = this.thirdSectionViewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, maindata);
      obj.index = 'thirdSection' + this.data.index;
      componentRef.instance.data = obj;
    } else {
    componentRef.instance.data = {
      id: maindata.id,
      index: 'thirdSection' + this.data.index,
      name: maindata.name,
      component: maindata.component,
      actionType: "",
      m:dragged.m,
        i:dragged.i,
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

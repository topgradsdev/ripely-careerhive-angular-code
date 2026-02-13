import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { TwoColumnSectionComponent } from '../two-column-section/two-column-section.component';
import { ThreeColumnSectionComponent } from '../three-column-section/three-column-section.component';
import { TextComponent } from '../text/text.component';
import { ImageComponent } from '../image/image.component';
import { LogoComponent } from '../logo/logo.component';
import { EmailTemplateButtonComponent } from '../email-template-button/email-template-button.component';
import { EmailTemplateSocialLinkComponent } from '../email-template-social-link/email-template-social-link.component';
import { EmailTemplateDividerComponent } from '../email-template-divider/email-template-divider.component';
import { EmailTemplateAttachmentComponent } from '../email-template-attachment/email-template-attachment.component';
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
  constructor(private cfr: ComponentFactoryResolver) {

  }

  // ngOnInit(): void {
  //   setTimeout(() => {
  //     if (this.data?.actionType === 'sort') {
  //       console.log("this.data", this.data, this.data?.droppedSectionItems.blankSections[0]?.instance);
  //       const obj = { data: this.data?.droppedSectionItems.blankSections[0]?.instance.data };
  //       obj['m'] = this.data?.droppedSectionItems.blankSections[0]?.instance.m;
  //       obj['i'] = this.data?.droppedSectionItems.blankSections[0]?.instance.i;
  //       console.log("obj", obj)
  //       this.data.droppedSectionItems.blankSections = [];
  //       this.onBlankSectionElementDrop({data:obj, m:this.data?.droppedSectionItems.blankSections[0]?.instance.m, i:this.data?.droppedSectionItems.blankSections[0]?.instance.i}, 'sort');
  //     }
  //   }, 100);
  // }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.data?.actionType === 'sort') {
        const section = this.data?.droppedSectionItems.blankSections?.[0]?.instance;
        if (!section) return;

        console.log("this.data", this.data, section);

        // let find = this.draggableEmailTemplateElements[1].items.i

        const obj = {
          data: section.data,
          m: section.data?.m,
          i: section.data?.i
        };

        console.log("obj", obj);

        // Clear previous section before sort-drop
        this.data.droppedSectionItems.blankSections = [];

        this.onBlankSectionElementDrop({ data: obj, m: obj.m?obj.m:0, i: obj.i?obj.i:0 }, 'sort');
      }
    }, 100);
  }

  onBlankSectionElementDrop(e: any, type?) {
    console.log("eeeee", e, this.data);

    if (this.data.droppedSectionItems.blankSections.length >= 1) {
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

    // if(component.name=="BlankSectionComponent" || component.name=="TwoColumnSectionComponent" || component.name=="ThreeColumnSectionComponent"){
    //   return false;
    // }
    if (['blank-section', 'two-section', 'three-section'].includes(dragged.data.type)) {
      return false;
    }
    console.log("component", component.name);

    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef: any = this.viewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, maindata);
      obj.index = this.data.index;
      componentRef.instance.data = obj;
    } else {
      componentRef.instance.data = {
        id: maindata.id,
        index: this.data.index,
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

    this.data.droppedSectionItems.blankSections.push(componentRef);
    console.log("this.data", this.data)
    // this.save();
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
     this.data.actionType = 'drag';
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BlankSectionComponent } from '../elements/blank-section/blank-section.component';
import { TwoColumnSectionComponent } from '../elements/two-column-section/two-column-section.component';
import { ThreeColumnSectionComponent } from '../elements/three-column-section/three-column-section.component';
import { EmailTemplateButtonComponent } from '../elements/email-template-button/email-template-button.component';
import { EmailTemplateSocialLinkComponent } from '../elements/email-template-social-link/email-template-social-link.component';
import { EmailTemplateDividerComponent } from '../elements/email-template-divider/email-template-divider.component';
import { ImageComponent } from '../elements/image/image.component';
import { LogoComponent } from '../elements/logo/logo.component';
import { TextComponent } from '../elements/text/text.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailTemplateAttachmentComponent } from '../elements/email-template-attachment/email-template-attachment.component';

@Component({
  selector: 'app-html-email',
  templateUrl: './html-email.component.html',
  styleUrls: ['./html-email.component.scss']
})
export class HtmlEmailComponent implements OnInit {
  formName = "New Email Template";
  isEditFormName = false;
  emailTemplateItemsType = ['blank-section', 'two-section', 'three-section', 'text', 'image', 'logo', 'button', 'social', 'divider', 'attachment'];
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
  droppedEmailTemplateItems = [];
  emailTemplateData = [];
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef;

  selectedIndex = 1;
  emailTemplateForm: FormGroup;
  categories = [];
  selectedTemplate: any;

  constructor(private cfr: ComponentFactoryResolver,
    private fb: FormBuilder,
    private router: Router,
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.emailTemplateForm = this.fb.group({
      subject: ['', [Validators.required]],
      category: ['', [Validators.required]],
      body: ['']
    });
    this.getEmailTemplateCategories();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.getEmailTemplateById(params.id);
      }
    });
  }

  getEmailTemplateById(id) {
    this.service.getEmailTemplateById({ _id: id }).subscribe((response: any) => {
      this.selectedTemplate = response.data[0];
      this.formName = this.selectedTemplate?.template_name;
      if (this.selectedTemplate.widgets?.values.length > 0) {
        this.droppedEmailTemplateItems = this.selectedTemplate.widgets?.values.map((widget, i) => {
          const component = this.getComponentName(widget.data.id);
          if (widget.item.blank.length > 0) {
            widget.item.blank[0]['component'] = this.getComponentName(widget.item.blank[0].id);
            widget.item.blank[0] = { instance: { data: widget.item.blank[0] } };
          }
          if (widget.item.two.first.length > 0) {
            widget.item.two.first[0]['component'] = this.getComponentName(widget.item.two.first[0].id);
            widget.item.two.first[0] = { instance: { data: widget.item.two.first[0] } };
          }
          if (widget.item.two.second.length > 0) {
            widget.item.two.second[0]['component'] = this.getComponentName(widget.item.two.second[0].id);
            widget.item.two.second[0] = { instance: { data: widget.item.two.second[0] } };
          }
          if (widget.item.three.first.length > 0) {
            widget.item.three.first[0]['component'] = this.getComponentName(widget.item.three.first[0].id);
            widget.item.three.first[0] = { instance: { data: widget.item.three.first[0] } };
          }
          if (widget.item.three.second.length > 0) {
            widget.item.three.second[0]['component'] = this.getComponentName(widget.item.three.second[0].id);
            widget.item.three.second[0] = { instance: { data: widget.item.three.second[0] } };
          }
          if (widget.item.three.third.length > 0) {
            widget.item.three.third[0]['component'] = this.getComponentName(widget.item.three.third[0].id);
            widget.item.three.third[0] = { instance: { data: widget.item.three.third[0] } };
          }

          widget = {
            id: widget.data.id,
            index: i + 1,
            name: widget.data.name,
            component: component,
            actionType: "drop",
            elementData: widget.data?.elementData ? widget.data?.elementData : { insideSection: false },
            droppedSectionItems: {
              blankSections: widget.item.blank,
              twoSections: {
                firstSection: widget.item.two.first,
                secondSection: widget.item.two.second
              },
              threeSections: {
                firstSection: widget.item.three.first,
                secondSection: widget.item.three.second,
                thirdSection: widget.item.three.third
              }
            }
          }
          return { instance: { data: widget } };
        });
        this.sortElement();
      }
      this.emailTemplateForm.patchValue({
        subject: this.selectedTemplate.subject,
        category: this.selectedTemplate.category
      });
    });
  }

  getComponentName(id) {
    let component: any = {};
    this.draggableEmailTemplateElements.forEach((item: any) => {
      const element = item.items.find(it => it.id === id);
      if (element) {
        component = element.component;
      }
    });
    return component;
  }

  getEmailTemplateCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  btnTabs(index: number) {
    if (this.emailTemplateForm.invalid) {
      this.emailTemplateForm.markAllAsTouched();
      return;
    }
    this.selectedIndex = index;
  }

  async onEmailTemplateElementDrop(e: any, type?) {

    const item =await this.draggableEmailTemplateElements.flatMap((group:any) => group.items).find(item => item.id === e?.data?.id);
    console.log("e: any, type?", e, type, item)
    const componentFactory = this.cfr.resolveComponentFactory(item.component);
    const componentRef: any = this.viewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, e.data);
      obj.index = this.droppedEmailTemplateItems.length + 1
      obj.actionType = 'sort';
      componentRef.instance.data = obj;
      this.droppedEmailTemplateItems.push(componentRef);
    } else if (type === 'copy') {
      const obj = Object.assign({}, e.data);
      obj.index = this.droppedEmailTemplateItems.length + 1
      obj.actionType = 'drop';
      componentRef.instance.data = obj;
      this.droppedEmailTemplateItems.splice(obj.index, 0, componentRef);
      this.sortElement();
    } else {
      componentRef.instance.data = {
        id: e.data.id,
        index: this.droppedEmailTemplateItems.length + 1,
        name: e.data.name,
        component: e.data.component,
        actionType: "drop",
        elementData: {},
        droppedSectionItems: {
          blankSections: [],
          twoSections: {
            firstSection: [],
            secondSection: []
          },
          threeSections: {
            firstSection: [],
            secondSection: [],
            thirdSection: []
          }
        },
        sectionElementsType: ['text', 'image', 'logo', 'button', 'social', 'divider', 'attachment']
      };
      this.droppedEmailTemplateItems.push(componentRef);
      this.reorderIndexing();
    }
    componentRef.instance.action.subscribe((result) => {
      if (result.actionType === 'delete') {
        this.removeComponent(result);
      }
      if (result.actionType === 'copy') {
        this.copyComponent(result);
      }
    });
  }

  removeComponent(element: any) {
    this.viewRef.remove(element.index - 1);
    this.droppedEmailTemplateItems.splice(element.index - 1, 1);
    this.reorderIndexing();
  }

  copyComponent(element: any) {
    const obj = Object.assign({}, { dragData: element });
    this.onEmailTemplateElementDrop(obj, 'copy');
    // this.reorderIndexing();
  }

  reorderIndexing() {
    this.droppedEmailTemplateItems.forEach((item, i) => {
      const parentItemIndex = i + 1;
      item.instance.data.index = i + 1;
      if (item.instance.data?.droppedSectionItems.blankSections.length > 0) {
        item.instance.data?.droppedSectionItems.blankSections.forEach((blankSectionItem, bsi) => {
          blankSectionItem.instance.data.index = parentItemIndex;
        });
      }
    });
  }

  sortEmailTemplateElement(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.droppedEmailTemplateItems, event.previousIndex, event.currentIndex);
    this.sortElement();
  }

  sortElement() {
    const items = this.droppedEmailTemplateItems;
    this.droppedEmailTemplateItems = [];
    this.viewRef.clear();
    items.forEach(item => {
      const obj = Object.assign({}, { dragData: item.instance.data });
      this.onEmailTemplateElementDrop(obj, 'sort');
    });
    this.reorderIndexing();
  }

  prepareEmailTemplate() {
    const emailTemplateData = [];
    this.droppedEmailTemplateItems.forEach(item => {
      const template: any = {
        data: {
          elementData: item.instance.data.elementData,
          id: item.instance.data.id,
          index: item.instance.data.index,
          name: item.instance.data.name
        },
        item: {
          blank: [],
          two: {
            first: [],
            second: []
          },
          three: {
            first: [],
            second: [],
            third: []
          }
        }
      };
      if (item.instance.data.droppedSectionItems.blankSections.length > 0) {
        template['item']['blank'] = item.instance.data.droppedSectionItems.blankSections.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      if (item.instance.data.droppedSectionItems.twoSections.firstSection.length > 0) {
        template['item']['two']['first'] = item.instance.data.droppedSectionItems.twoSections.firstSection.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      if (item.instance.data.droppedSectionItems.twoSections.secondSection.length > 0) {
        template['item']['two']['second'] = item.instance.data.droppedSectionItems.twoSections.secondSection.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      if (item.instance.data.droppedSectionItems.threeSections.firstSection.length > 0) {
        template['item']['three']['first'] = item.instance.data.droppedSectionItems.threeSections.firstSection.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      if (item.instance.data.droppedSectionItems.threeSections.secondSection.length > 0) {
        template['item']['three']['second'] = item.instance.data.droppedSectionItems.threeSections.secondSection.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      if (item.instance.data.droppedSectionItems.threeSections.thirdSection.length > 0) {
        template['item']['three']['third'] = item.instance.data.droppedSectionItems.threeSections.thirdSection.map(section => {
          return Object.assign({}, section.instance.data);
        });
      }
      emailTemplateData.push(template);
    });

    console.log("emailTemplateData", emailTemplateData);
    return emailTemplateData;
  }

  getPreviewData() {
    this.emailTemplateData = this.prepareEmailTemplate();
  }

  saveEmailTemplate() {
    if (this.emailTemplateForm.invalid) {
      this.emailTemplateForm.markAllAsTouched();
      return;
    }
    const html_template = document.getElementById("html_template")?.innerHTML;
    console.log("html_template", html_template);
    this.emailTemplateData = this.prepareEmailTemplate();
    const payload: any = {
      subject: this.emailTemplateForm.value.subject,
      category: this.emailTemplateForm.value.category,
      widgets: { html: html_template, values: this.emailTemplateData },
      message: "",
      template_name: this.formName,
      type: 'html'
    }

    console.log("this.emailTemplateDatathis.emailTemplateData", this.emailTemplateData, "this.emailTemplateDatathis.emailTemplateDatathis.emailTemplateData")

    console.log("payload", payload)

    if (this.selectedTemplate?._id) {
      payload._id = this.selectedTemplate._id;
    }
    this.service.createHtmlTemplate(payload).subscribe((res: any) => {
      this.router.navigate(['/admin/email-templates']);
      this.service.showMessage({
        message: "Email Template saved successfully"
      });
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  getCategoryName(id) {
    return this.categories.find(category => category._id === id)?.category_title;
  }
}

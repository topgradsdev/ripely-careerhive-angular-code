import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MultilineFieldComponent } from '../elements/multiline-field/multiline-field.component';
import { SinglelineFieldComponent } from '../elements/singleline-field/singleline-field.component';
import { NumberFieldComponent } from '../elements/number-field/number-field.component';
import { DateFieldComponent } from '../elements/date-field/date-field.component';
import { TimeFieldComponent } from '../elements/time-field/time-field.component';
import { YesNoFieldComponent } from '../elements/yes-no-field/yes-no-field.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LikertScaleFieldComponent } from '../elements/likert-scale-field/likert-scale-field.component';
import { DropdownFieldComponent } from '../elements/dropdown-field/dropdown-field.component';
import { CheckboxFieldComponent } from '../elements/checkbox-field/checkbox-field.component';
import { RadioFieldComponent } from '../elements/radio-field/radio-field.component';
import { ChipsFieldComponent } from '../elements/chips-field/chips-field.component';
import { AttachmentsFieldComponent } from '../elements/attachments-field/attachments-field.component';
import { ImageFieldComponent } from '../elements/image-field/image-field.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from '../../../topgradservice.service';
import { SignatureFieldComponent } from '../elements/signature-field/signature-field.component';
import { DescriptionFieldComponent } from '../elements/description-field/description-field.component';
import { DownloadableContentComponent } from '../elements/downloadable-content/downloadable-content.component';
@Component({
  selector: 'app-single-page-form',
  templateUrl: './single-page-form.component.html',
  styleUrls: ['./single-page-form.component.scss']
})
export class SinglePageFormComponent implements OnInit {
  formName = "New Form";
  isEditFormName = false;
  itemsType = ['text', 'textarea', 'number', 'date', 'time', 'yes_no', 'select', 'checkbox', 'radio', 'chips', 'likert', 'file', 'img', 'signature', 'description', 'downloadable'];
  draggableElements = [
    {
      element: 'Text Elements',
      items: [
        { id: 'single', name: 'Single Line', icon: 'single-line', type: 'text', component:SinglelineFieldComponent },
        { id: 'multi', name: 'Multiline', icon: 'multi-line', type: 'textarea', component: MultilineFieldComponent },
        { id: 'number', name: 'Number', icon: 'number', type: 'number', component: NumberFieldComponent }
      ]
    },
    {
      element: 'Date Elements',
      items: [
        { id: 'date', name: 'Date', icon: 'date', type: 'date', component: DateFieldComponent },
        { id: 'time', name: 'Time', icon: 'time', type: 'time', component: TimeFieldComponent }
      ]
    },
    {
      element: 'Multi Elements',
      items: [
        // { id: 'yes_no', name: 'Yes/No', icon: 'yes-no', type: 'yes_no', component: YesNoFieldComponent },
        { id: 'dropdown', name: 'Dropdown', icon: 'dropdown', type: 'select', component: DropdownFieldComponent },
        { id: 'checkbox', name: 'Checkbox', icon: 'checkbox', type: 'checkbox', component: CheckboxFieldComponent },
        { id: 'radio', name: 'Radio Button', icon: 'radio', type: 'radio', component: RadioFieldComponent },
        // { id: 'chips', name: 'Chips', icon: 'chips', type: 'chips', component: ChipsFieldComponent },
        { id: 'likert', name: 'Likert Scale', icon: 'likert-scale', type: 'likert', component: LikertScaleFieldComponent }
      ]
    },
    {
      element: 'Media Elements',
      items: [
        { id: 'attachment', name: 'Attachments', icon: 'attachment', type: 'file', component: AttachmentsFieldComponent },
        // { id: 'image', name: 'Image', icon: 'image', type: 'img', component: ImageFieldComponent },
        // { id: 'signature', name: 'Signature', icon: 'signature', type: 'signature', component: SignatureFieldComponent }
      ]
    },
    {
      element: 'Description',
      info:true,
      info_des: 'This element is non-interactive for the form recipients.',
      items: [
        { id: 'description', name: 'Description', icon: 'description', type: 'textarea', component: DescriptionFieldComponent },
        { id: 'downloadable', name: 'Downloadable Content', icon: 'downloadable', type: 'downloadable', component: DownloadableContentComponent },
        { id: 'image', name: 'Image', icon: 'image', type: 'img', component: ImageFieldComponent },
      ]
    }
  ];
  searchValue:any = '';
  droppedItems = [];
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
  elementsForm = new FormGroup({});
  fields: any;
  @ViewChild('previewSinglePageModal') public previewSinglePageModal: ModalDirective;
  @ViewChild('alreadyExist') public alreadyExist: ModalDirective;

  isAddSubmitter = false;
  submitters = [
    { name: 'Students', letter: 's' },
    { name: 'Employers', letter: 'e' },
    { name: 'Students & Employers', letter: 'se' }
  ];
  savedSubmitters: any;
  selectedForm: any;
  selectedSubmitter = null;
  isSuccess = true;

  constructor(private router: Router,
    private cfr: ComponentFactoryResolver,
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.getFormById(params.id);
      }
      if (params.submitter) {
        this.selectedSubmitter = params.submitter;
      }
    });
  }

  findForm:any = null
  onFormTypeChange(selected: string) {
    if(selected === 'Incident Reporting'){
        const payload = {
          submiters:  this.selectedSubmitter=='Students' ? 's':this.selectedSubmitter=='Employers'?"e":null
        }
        this.service.getreportForm(payload).subscribe(async response => {
          console.log("response", response)
          if(response.code==200){
            if(response.data){
               this.findForm = response.data;
               this.alreadyExist.show();
            }
          }
        });
      
    }
  }


  form_type:any = 'Workflow';  
  getFormById(id) {
    this.service.getFormById({ _id: id }).subscribe((response: any) => {
      this.selectedForm = response.data[0];
      this.formName = this.selectedForm?.title;
      this.checked = this.selectedForm.is_hcaaf;
      this.hcaaf_validation = this.selectedForm?.hcaaf_validation;
       this.form_type = this.selectedForm.form_type?this.selectedForm.form_type:this.selectedForm.is_hcaaf?'Host Company Agreement & Assessment Form (HCAAF)':'Workflow';
      this.autoRenewal = this.selectedForm.is_autoRenewal;
      this.selectedSubmitter = response.data[0].submiters;
      this.selectedSubmitter = this.submitters.find(sub => sub.letter === response.data[0].submiters)?.name;
      // if (this.savedSubmitters?.length > 0) {
      //   this.isAddSubmitter = false;
      //   this.submitters.forEach((submitter) => {
      //     const found = this.savedSubmitters.find(sub => sub.name === submitter.name);
      //     if (found) {
      //       submitter.selected = true;
      //     }
      //   });
      // }
      if (this.selectedForm.widgets?.values?.length > 0) {

        this.droppedItems = this.selectedForm.widgets?.values?.map((widget, i) => {
          const component = this.getComponentDetailsById(widget.id);
          widget = {
            id: widget.id,
            index: i + 1,
            name: widget.name,
            isElementWidthFull: widget.isElementWidthFull,
            component: component.component,
            m:component.groupIndex,
            i:component.itemIndex,
            elementData: widget?.elementData ? widget?.elementData : {},
            logic: widget?.logic ? widget?.logic : {},
            componentName:this.selectedForm.widgets?.values.map(el => el.name)
          }
          return { instance: { data: widget } };
        });


        this.sort();
      }
    });
  }

  // getComponentName(id) {
  //   let component: any = {};
  //   this.draggableElements.forEach((item: any, index:any) => {
  //     const element = item.items.find(it => it.id === id);
  //     if (element) {
  //       component = element.component;
  //     }
  //   });
  //   return component;
  // }

  getComponentDetailsById(id: string): { component: any, groupIndex: number, itemIndex: number } | null {
  for (let groupIndex = 0; groupIndex < this.draggableElements.length; groupIndex++) {
    const group = this.draggableElements[groupIndex];
    const itemIndex = group.items.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      const component = group.items[itemIndex].component;
      return {
        component,
        groupIndex,
        itemIndex
      };
    }
  }
  return null;
}

  getElementFields(elementName: string) {
    return {
      fieldType: "",
      title: "",
      required: false,
      description: "",
      value: "",
      min: 0,
      max: 0
    }
  }

  

  // onElementDrop(e: any, type?) {
  //   const componentFactory = this.cfr.resolveComponentFactory(e.dragData.component);
  //   const componentRef: any = this.viewRef.createComponent(componentFactory);
  //   if (type === 'sort') {
  //     e.dragData.index = this.droppedItems.length + 1
  //     componentRef.instance.data = e.dragData;
  //   } else {
  //     componentRef.instance.data = {
  //       id: e.dragData.id,
  //       index: this.droppedItems.length + 1,
  //       name: e.dragData.name,
  //       component: e.dragData.component,
  //       actionType: "",
  //       isElementWidthFull: true,
  //       elementData: {}
  //     };

  //     componentRef.instance.allField = this.prepareFormData();
  //   }
  //   this.droppedItems.push(componentRef);
  //   this.reorderIndexing();
  //   componentRef.instance.action.subscribe((result) => {
  //     if (result.actionType === 'delete') {
  //       this.removeComponent(result);
  //     } else {
  //     }
  //   });
  // }

  @ViewChild('deleteAlert') public deleteAlert: ModalDirective;
  password:any = "";
  pass: String = 'password'

  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }

  deleteResult:any;

  listLink:any = [];

  getAutofillForms(name, type){
    console.log("name", name)
    if(this.selectedForm && this.selectedForm?._id){
      this.service.getAutofillForms({ link_form_id: this.selectedForm._id, 'link_field_name':name?.elementData?.title }).subscribe((response: any) => {
        if(response.status == 200){
          if(response.result.length>0){
            this.listLink = response.result;
            this.deleteAlert.show();
          }else{
            this.removeComponent(this.deleteResult, type);
          }
        
        }else{
          this.removeComponent(this.deleteResult, type);
        }    
      });
    }else{
      this.removeComponent(this.deleteResult, type);
    }
    
  }

 getDraggableItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    icon: item.icon,
    type: item.type,
    component: item.component  // important: preserve the class reference
  };
}

  removeAutoFields:any = []

updateLogic:any = [];

@ViewChild('removeLogicModel') removeLogicModel: ModalDirective;

   removeLogic(item){
    const payload = {
      _id: item?.logic?.logic_id,
    }
    this.service.removeFormLogic(payload).subscribe(async(res: any) => {
          if(this.selectedForm && this.selectedForm?._id){
            this.getAutofillForms(item, 'remove');
          }else{
            this.removeComponent(item, 'remove');
          } 
          this.removeLogicModel.hide();
          // setTimeout(()=>{
            
          // }, 500)
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }


  onElementDrop(e: any, type?) {
    console.log("e", e);
    let dragged = e?.data;
   
   console.log("dragged", dragged, this.droppedItems);

    if(dragged.data.name && dragged.data.id!='image'){
    let baseName = dragged.data.name; // e.g. "Single Line 1"

      // Remove any trailing number to get the true base name
      baseName = baseName.replace(/\s*\d+$/, '').trim();

      let prevStep = this.droppedItems;
      if (!prevStep) return;

      let allComponents = prevStep || [];

      let matching = allComponents.filter(el =>
        el.instance.data.name.replace(/\s*\d+$/, '').trim() === baseName
      );
      if (matching.length > 0) {
        // Get the highest existing number
        let maxNum = 0;
        matching.forEach(el => {
          const match = el.instance.data.name.match(/(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });

        dragged.data.name = `${baseName} ${maxNum + 1}`;
      } else {
        // dragged.data.name = `${baseName} 1`;
      }

    }
   let component:any = this.draggableElements[dragged.m] && this.draggableElements[dragged.m].items[dragged.i] && this.draggableElements[dragged.m].items[dragged.i].component?this.draggableElements[dragged.m].items[dragged.i].component:null;
   console.log("componentcomponent", component, dragged.data.id)
   if(!component){
    const matchedGroup:any= this.draggableElements.find(group =>
      group.items.some(item => item.id === dragged.data.id)
    );
    console.log("matchedGroup", matchedGroup);

    component = matchedGroup?.items.find(item => item.id === dragged.data.id)?.component;
   }
   console.log("component", component);
    dragged['component'] = component
    let maindata = {
      ...dragged.data,
      // elementData:{...dragged.data?.elementData},
      component:component
    }

    console.log("maindata", maindata);
    // return false;
    // if (!dragged?.component) {
    //   console.error('Dropped data is missing component:', dragged);
    //   return;
    // }
    // return false;
   

    const componentFactory = this.cfr.resolveComponentFactory(component);
    let componentRef: any = this.viewRef.createComponent(componentFactory);
  
    if (type === 'sort') {
      maindata.index = this.droppedItems.length + 1;
      componentRef.instance.data = maindata;
    } else {
      componentRef.instance.data = {
        id: maindata.id,
        index: this.droppedItems.length + 1,
        name: maindata.name,
        component: component,
        actionType: "",
        isElementWidthFull: true,
        elementData: {},
        logic:{},
        componentName:this.droppedItems.map(el => el.instance.data.name)
      };
      componentRef.instance.allField = this.prepareFormData();
    }

    this.droppedItems.push(componentRef);


     let prev1Step = this.droppedItems;
    // console.log("prev1Step", prev1Step);
    if (prev1Step && Array.isArray(prev1Step)) {
      // Create name list once
      const nameArray = prev1Step.map(el => el.instance.data.name);
      //  Assign it to each component
      prev1Step.forEach(element => {
        element.instance.data.componentName = nameArray;
      });
    }

    this.reorderIndexing();
  
    componentRef.instance.action.subscribe(async (result) => {
      console.log("result", result);
      if(result.removeData){
        this.removeAutoFields.push({
          link_field_name:result.removeData,
          current_form_id:this.selectedForm._id
        })
        delete result.removeData;
      }

      if (result.actionType === 'delete') {

         this.deleteResult = result;
         if(this.deleteResult && this.deleteResult.logic && this.deleteResult.logic.logic_id){
            this.removeLogicModel.show();
            return false;
         }else{
          if(this.selectedForm && this.selectedForm?._id){
            this.getAutofillForms(result, '');
          }else{
            this.removeComponent(result);
          }  
         }
        //  this.removeComponent(result);
       
      } else {



        this.viewRef.clear(); 
        this.droppedItems.forEach(item => {
          const newFactory = this.cfr.resolveComponentFactory(item.instance.constructor);
          componentRef = this.viewRef.createComponent(newFactory);
          componentRef.instance.action = item.instance.action;
          componentRef.instance.data = item.instance.data;
          componentRef.instance.data.actionType = '';
          componentRef.instance.allField = this.prepareFormData();
        });

        this.droppedItems.map(e=>{
          if(e.instance.data.logic.action == "show_field" || e.instance.data.logic.action === "hide_field"){
              if(e.instance.data.logic.hide_show_field == result.oldname && result.oldname != result.name){
                e.instance.data.logic.hide_show_field  = result.name;
                this.updateLogic.push(e.instance.data.logic)
              }else{
                if(result.oldname != result.name && (e.instance.data.logic._id  || e.instance.data.logic.logic_id)){
                  e.instance.data.logic.field_name  = result.name;
                  this.updateLogic.push(e.instance.data.logic)
                }
              }
            }
        })


        this.cdr.detectChanges();
      }
    });
  }
  

  removeComponent(element: any, status = '') {
    this.viewRef.remove(element.index - 1);
    this.droppedItems.splice(element.index - 1, 1);
    this.reorderIndexing();
    this.cdr.detectChanges();  // Trigger change detection if needed
    if(status=='remove'){
        this.saveSinglePageForm('save-remove');
    }
  }

  reorderIndexing() {
    this.droppedItems.forEach((item, i) => {
      item.instance.data.index = i + 1;
    });
    this.cdr.detectChanges();  // Trigger change detection if needed
  }

  sortElement(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.droppedItems, event.previousIndex, event.currentIndex);
    this.sort();
  }

  sort() {
    const items = this.droppedItems;
    this.droppedItems = [];
    this.viewRef.clear();
    console.log("items", items);
    items.forEach(item => {
      console.log("item",item)
      let obj = { data: item.instance.data };
      obj['m'] = item.instance.data.m;
      obj['i'] = item.instance.data.i;
      console.log("obj", obj)
      // return false;
      this.onElementDrop({data:obj}, 'sort');
    });
  }

  prepareFormData() {
    const fields: any = [];
    this.droppedItems.forEach(item => {
      // console.log("item", item)
      const data = {
        elementData: item.instance?.data?.elementData &&
             Object.keys(item.instance.data.elementData).length > 0
  ? item.instance.data.elementData
  : {
      ...(item.instance?.data?.elementData || {}),
      value: ""
    },

        id: item.instance.data.id,
        logic: item.instance.data.logic,
        index: item.instance.data.index,
        name: item.instance.data.name,
        isElementWidthFull: item.instance.data.isElementWidthFull
      }
      fields.push(data);
    });
    return fields;
  }


 
  previewSinglePageForm() {
    if (this.droppedItems.length === 0) {
      return;
    }
    this.fields = this.prepareFormData();
    this.fields.forEach(element => {

      element['fieldName'] = element.name.toLowerCase().split(' ').join('_');
      this.elementsForm.addControl(element.fieldName, new FormControl(element.elementData.value ? element.elementData.value : ""));
    });

    console.log("this.fieldsthis.fields", this.fields);
    this.previewSinglePageModal.show();
  }

  getSubmitterLetter() {
    return this.submitters.find(sub => sub.name === this.selectedSubmitter)?.letter.toLocaleLowerCase();
  }

  checked: any = false;
  autoRenewal:any = false;
  autoFeilds:any = [];
  hcaaf_validation:any = 12
  saveSinglePageForm(type='') {
    if (this.droppedItems.length === 0) {
      return;
    }
    this.fields = this.prepareFormData();
    const html_template = document.getElementById("html_template")?.innerHTML;
    const payload: any = {
      title: this.formName,
      widgets: { html: html_template, values: this.fields },
      submiters: this.getSubmitterLetter(),
      type: 'simple',
      'is_hcaaf': this.checked,
      'form_type':this.form_type,
      'is_autoRenewal':this.autoRenewal,
      hcaaf_validation: this.hcaaf_validation
    }
    if (this.selectedForm?._id || this.findForm?._id) {
      payload._id =this.findForm?._id?this.findForm?._id: this.selectedForm._id;
    }
    this.isSuccess = false;
    this.service.createForm(payload).subscribe(async(res: any) => {
      if(type=='save-remove'){

      }else if(type=='save'){
        if(this.updateLogic.length == 0){
              this.router.navigate(
                ['/admin/form-builder/conditional-logic-list'],
                { queryParams: { id: res?.data?._id || this.selectedForm?._id || null } }
              );
        }else{
           for (let index = 0; index < this.updateLogic.length; index++) {
            const element = this.updateLogic[index];
              this.updateLogicForm(element, this.selectedForm && this.selectedForm._id? this.selectedForm._id:res?.data?._id,);
              if(index == this.updateLogic.length-1){
                this.router.navigate(
                  ['/admin/form-builder/conditional-logic-list'],
                  { queryParams: { id: res?.data?._id || this.selectedForm?._id || null } }
                );
              }
          }
        }
       
        // this.router.navigate(
        //   ['/admin/form-builder/conditional-logic-list'],
        //  { queryParams: { id: res?.data?._id || this.selectedForm?._id || null } }
        // );
      }else{
        await this.fields.map(el=>{
          if(el.elementData.Autofill && el.elementData.field){
            this.autoFeilds.push({
              name:el.elementData.title,
              alias:el.elementData.alias?el.elementData.alias:'',
              link_table:el.elementData.alias? el.elementData.Autofill: "",
              link_form_id:el.elementData.Autofill,
              link_field_name: el.elementData.field,
              current_form_id:this.selectedForm && this.selectedForm._id? this.selectedForm._id:res?.data?._id,
              current_field_name:el.elementData.title,
              'type':'simple'
            });''
          }
        })

         for (let index = 0; index < this.updateLogic.length; index++) {
          const element = this.updateLogic[index];
            this.updateLogicForm(element, this.selectedForm && this.selectedForm._id? this.selectedForm._id:res?.data?._id,);
            // if(index == this.updateLogic.length-1){
            //    this.router.navigate(
            //     ['/admin/form-builder/conditional-logic-list'],
            //     { queryParams: { id: res?.data?._id || this.selectedForm?._id || null } }
            //   );
            // }
        }
        if(this.autoFeilds.length>0){
            this.saveAutoFields(this.autoFeilds);
        }else{
          this.router.navigate(['/admin/form-builder/form-builder-list']);
          this.service.showMessage({
            message: "Form saved successfully"
          });
          this.isSuccess = true;
        }

        if(this.removeAutoFields.length>0){
            this.deleteAutoFields();
        } 
      }
      
    }, err => {
      this.isSuccess = true;
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  updateLogicForm(data, id){
    if(data._id || data.logic_id){
      const body = {
          ...data,
          _id: data._id || data.logic_id,   // use existing _id or fallback to login_id
          form_id: id
        };
      this.service.createFormLogic(body).subscribe(async(res: any) => { 

      }, err => {
        // this.service.showMessage({
        //   message: err.msg ? err.msg : 'Something went Wrong'
        // });
      });
    }
  }

  deleteAutoFields(){
    this.service.deleteAutoForm(this.removeAutoFields).subscribe(async(res: any) => {
    
    }, err => {
    
    });
  }

  saveAutoFields(data){
    this.service.createAutoForm(data).subscribe(async(res: any) => {
        this.router.navigate(['/admin/form-builder/form-builder-list']);
        this.service.showMessage({
          message: "Form saved successfully"
        });
        this.isSuccess = true;
        this.deleteAutoFields();
    }, err => {
      this.isSuccess = true;
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  cancelSinglePageModal() {
    this.previewSinglePageModal.hide();
  }

  // saveSubmitters() {
  //   this.isAddSubmitter = !this.isAddSubmitter;
  //   this.savedSubmitters = this.submitters.filter(submitter => submitter.selected);
  // }

  // removeSubmitters() {
  //   this.submitters.forEach(submitter => {
  //     submitter.selected = false;
  //   });
  //   this.isAddSubmitter = !this.isAddSubmitter;
  //   this.savedSubmitters = this.submitters.filter(submitter => submitter.selected);
  // }

  // isSubmittersAdded() {
  //   return this.submitters.some(submitter => {
  //     return submitter.selected
  //   });
  // }

  downloadFile(url: string) {
    window.open(url);
  }

  async downloadPDF(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('There was an error downloading the PDF:', error);
      this.downloadFile(url);
    }
  }

  async viewPDF(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      window.open(blobURL, '_blank');
      window.URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('There was an error viewing the PDF:', error);
      this.downloadFile(url);
    }
  }
}

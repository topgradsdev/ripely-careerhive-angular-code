import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CheckboxFieldComponent } from '../elements/checkbox-field/checkbox-field.component';
import { ChipsFieldComponent } from '../elements/chips-field/chips-field.component';
import { DateFieldComponent } from '../elements/date-field/date-field.component';
import { DropdownFieldComponent } from '../elements/dropdown-field/dropdown-field.component';
import { LikertScaleFieldComponent } from '../elements/likert-scale-field/likert-scale-field.component';
import { MultilineFieldComponent } from '../elements/multiline-field/multiline-field.component';
import { NumberFieldComponent } from '../elements/number-field/number-field.component';
import { RadioFieldComponent } from '../elements/radio-field/radio-field.component';
import { SinglelineFieldComponent } from '../elements/singleline-field/singleline-field.component';
import { TimeFieldComponent } from '../elements/time-field/time-field.component';
import { YesNoFieldComponent } from '../elements/yes-no-field/yes-no-field.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { ImageFieldComponent } from '../elements/image-field/image-field.component';
import { AttachmentsFieldComponent } from '../elements/attachments-field/attachments-field.component';
import { TopgradserviceService } from '../../../topgradservice.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { SignatureFieldComponent } from '../elements/signature-field/signature-field.component';
import { DescriptionFieldComponent } from '../elements/description-field/description-field.component';
import { DownloadableContentComponent } from '../elements/downloadable-content/downloadable-content.component';

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.scss']
})
export class MultiStepFormComponent implements OnInit {
  formName = "New Form";
  isEditFormName = false;
  stepsType = ['Student Details', 'Host Organization', 'Workspace Supervisor', 'Duty Online', 'Schedule', 'Submit'];
  droppedSteps: any = [];
  itemsType = ['text', 'textarea', 'number', 'date', 'time', 'yes_no', 'select', 'checkbox', 'radio', 'chips', 'likert', 'file', 'img', 'signature', 'description', 'downloadable'];
  draggableElements = [
    {
      element: 'Text Elements',
      items: [
        { id: 'single', name: 'Single Line', icon: 'single-line', type: 'text', component: SinglelineFieldComponent },
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
  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
  elementsForm = new FormGroup({});
  fields: any;
  @ViewChild('addStepModal') public addStepModal: ModalDirective;
  @ViewChild('previewMultiStepPageModal') public previewMultiStepPageModal: ModalDirective;
  @ViewChild('alreadyExist') public alreadyExist: ModalDirective;
  @ViewChild('setPermissionPage') public setPermissionPage: ModalDirective;
  @ViewChild('ruleReadSuccess') public ruleReadSuccess: ModalDirective;

  

  
  isAddSubmitter = false;
  submitters = [
    { name: 'Students', letter: 's' },
    { name: 'Employers', letter: 'e' },
    { name: 'Students & Employers', letter: 'se' }
  ];
  savedSubmitters: any;
  selectedIndex = 1;
  step_name = "";
  stepHeadingForAddModal = "Add";
  selectedStep = null;
  stepper = [];
  // stepper = [
  //   {
  //     "_id": "",
  //     "name": "Student Details",
  //     "index": 1,
  //     "color": "#FFD569",
  //     "component": []
  //   },
  //   {
  //     "_id": "",
  //     "name": "Host Organization",
  //     "index": 2,
  //     "color": "#9747FF",
  //     "component": []
  //   },
  //   {
  //     "_id": "",
  //     "name": "Workspace Supervisor",
  //     "index": 3,
  //     "color": "#27AE60",
  //     "component": []
  //   },
  //   {
  //     "_id": "",
  //     "name": "Duty Online",
  //     "index": 4,
  //     "color": "#ED893E",
  //     "component": []
  //   },
  //   {
  //     "_id": "",
  //     "name": "Schedule",
  //     "index": 5,
  //     "color": "#F25094",
  //     "component": []
  //   },
  //   {
  //     "_id": "",
  //     "name": "Submit",
  //     "index": 6,
  //     "color": "#202C76",
  //     "component": []
  //   }
  // ];
  searchStep = "";
  stepColors = ['#FFD569', '#9747FF', '#27AE60', '#ED893E', '#F25094', '#202C76'];
  selectedHeaderStepForComponent: any;
  multiStepFormPreviewData: any;
  multi_step: any;
  selectedForm: any;
  selectedSubmitter = null;
  isSuccess = true;

  student_read:boolean = true;
  employer_read:boolean = true;
  constructor(private service: TopgradserviceService,
    private cfr: ComponentFactoryResolver,
    private router: Router,
    private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllFormSteps();
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

      console.log("response", response);
      this.selectedForm = response.data[0];
      this.formName = this.selectedForm?.title;
      this.checked = this.selectedForm.is_hcaaf;
      this.hcaaf_validation = this.selectedForm?.hcaaf_validation;
      this.form_type = this.selectedForm.form_type?this.selectedForm.form_type:this.selectedForm.is_hcaaf?'Host Company Agreement & Assessment Form (HCAAF)':'Workflow';
      this.autoRenewal = this.selectedForm.is_autoRenewal;
      this.savedSubmitters = response.data[0].submiters;
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
      console.log("this.selectedForm" ,this.selectedForm);
      // return false;
      if (this.selectedForm.widgets?.values?.length > 0) {
        const steps: any = [];
        this.selectedForm.widgets?.values?.forEach((widget, i) => {
          const step = {
            color: widget.color,
            component: [],
            index: i + 1,
            name: widget.name,
            _id: widget._id,
           permissions: {
              student: { read: widget?.permissions?.student?.read ?? true },
              employer: { read: widget?.permissions?.employer?.read ?? true }
            }

          }
          widget.component.forEach((comp, j) => {
            const component = this.getComponentName(comp.id);
            //  const component = this.getComponentDetailsById(widget.id);
            console.log("component = = = == ", component)
            comp = {
              id: comp.id,
              index: j + 1,
              name: comp.name,
              isElementWidthFull: comp.isElementWidthFull,
              component: component,
              i:i,
              m:j,
              elementData: comp?.elementData ? comp.elementData : {},
              logic: comp?.logic ? comp.logic : {},
              componentName:widget.component.map(el => el.name)
            }
            step.component.push({ instance: { data: comp } });
          });
          return steps.push(step);
        });
        console.log("steps", steps)
        this.droppedSteps = steps;
        console.log(" this.droppedSteps",  this.droppedSteps)
        setTimeout(() => {
          this.sort();
        }, 1000);
      }
    });
  }

  // getComponentName(id) {
  //   let component: any = {};
  //   console.log("id", id)
  //   this.draggableElements.forEach(async(item: any) => {
  //     const element =await item.items.find(it => it.id === id);
  //     if (element) {
  //       component = element.component;
  //     }
  //   });
  //   return component;
  // }


  setValue(step){
    console.log("step", step)
    this.selectedStep = step;
    this.student_read = this.selectedStep.permissions['student'].read;
    this.employer_read = this.selectedStep.permissions['employer'].read
  }

  addPermission(type: string, user: string, selectedStep: any) {
    const index = this.droppedSteps.findIndex(
      e => e.name === selectedStep.name && e.index === selectedStep.index
    );

    if (index !== -1) {
      // Get the permission object for the given user (e.g., 'student' or 'employer')
      const currentPermission = this.droppedSteps[index].permissions[user][type];

      // Toggle the permission value
      this.droppedSteps[index].permissions[user][type] = !currentPermission;

      console.log(
        `Permission [${type}] for ${user} updated to`,
        this.droppedSteps[index].permissions[user][type]
      );
    } else {
      console.warn('Step not found in droppedSteps:', selectedStep);
    }
  }

  saveRule(){
      console.log("this.selectedStep", this.selectedStep, this.droppedSteps);
      this.setPermissionPage.hide();
      this.ruleReadSuccess.show();
  }


  getComponentName(id: string): any {
    for (const group of this.draggableElements) {
       console.log("group", group)
      const items = group.items as Array<{ id: string; component: any }>;
      console.log("items", items)
      const found = items.find(item => item.id === id);
      console.log("found", found)
      if (found) {
        return found.component;
      }
    }
    console.warn(`Component not found for id: ${id}`);
    return null;
  }


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


  // btnTabs(index: number) {
  //   console.log("this.droppedSteps", this.droppedSteps);
  //   this.selectedIndex = index;
  //   this.selectedHeaderStepForComponent = this.droppedSteps[this.selectedIndex - 1];
  //   const items = this.droppedSteps[this.selectedIndex - 1];
    
  //   this.viewRef.clear();
  //   console.log("items", items);
  //   items.forEach(item => {
  //    let obj = { data: item.instance.data };
  //     obj['m'] = item.instance.data.m;
  //     obj['i'] = item.instance.data.i;
  //     console.log("obj", obj)
  //   // this.onElementDrop({data:obj}, 'sort');
  //     this.onElementDrop({data:obj});
  //   });
  //   this.droppedSteps[this.selectedIndex - 1].component = [];
  // }

   btnTabs(index: number) {
    this.selectedIndex = index;
    this.selectedHeaderStepForComponent = this.droppedSteps[this.selectedIndex - 1];
    const items = this.droppedSteps[this.selectedIndex - 1].component;
    this.droppedSteps[this.selectedIndex - 1].component = [];
    this.viewRef.clear();
    items.forEach(item => {
      console.log("item", item.instance.data);
      const obj = { data: item.instance.data, m:item.instance.data.m, i:item.instance.data.i };
      this.onElementDrop({data:obj});
    });
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

  openAddStepModal(isEdit, step?) {
    if (isEdit) {
      this.step_name = step.name;
      this.selectedStep = step;
      this.stepHeadingForAddModal = 'Rename';
    } else {
      // if (this.stepper.length >= 6) {
      //   this.service.showMessage({ message: "You can't add more than 6 step" });
      //   return;
      // }
      if (this.droppedSteps.length >= 6) {
        this.service.showMessage({ message: "You can't add more than 6 step" });
        return;
      }
      this.stepHeadingForAddModal = "Add";
      this.step_name = "";
    }
    this.addStepModal.show();
  }

  cancelAddStepModal() {
    this.addStepModal.hide();
  }

  getAllFormSteps() {
    this.service.getFormSteps().subscribe((response: any) => {
      const result = response.data;
      console.log("resultresult", result);
      this.stepper = [];
      result.forEach(res => {
        this.stepper.push({ _id: res._id, name: res.title, index: this.stepper.length + 1, color: this.stepColors[this.stepper.length], component: [] });
        this.stepsType.push(res.title);
      });
    });
  }

  createStep() {
    // if (this.stepper.length >= 6) {
    //   return;
    // }
    if (this.droppedSteps.length >= 6) {
      return;
    }
    if (!this.step_name.trim()) {
      return;
    }
    const payload = {
      title: this.step_name
    }
    this.service.createFormStep(payload).subscribe((res: any) => {
      // this.getAllFormSteps();
      if(res.code ==200){
        // {
        //     "title": "Page 1",
        //     "create_by": "673735eeadd276ae025999c1",
        //     "_id": "68da09c2c533ec9754936461",
        //     "createdAt": "2025-09-29T04:23:30.748Z",
        //     "updatedAt": "2025-09-29T04:23:30.748Z"
        // }
        this.droppedSteps.push({ _id: res.data._id, name: res.data.title, index: this.droppedSteps.length + 1, color: this.stepColors[this.droppedSteps.length], component: [], permissions: {   // plural
              student: { read: true },
              employer: { read: true }
            } });
        this.stepsType.push(res.data.title);
        // this.droppedSteps.push(res.da
        // ta.title);
        this.reOrderIndex();
      }

     
      this.addStepModal.hide();
      this.service.showMessage({
        message: "Form step created successfully"
      });
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  renameStep() {
    this.selectedStep.name = this.step_name;
    this.droppedSteps.forEach((step, i) => {
      if (i === this.selectedStep.index - 1) {
        step.name = this.selectedStep.name
      }
    });
    this.selectedStep = null;
    this.addStepModal.hide();
  }

  deleteDroppedStep() {
    this.droppedSteps.splice(this.selectedStep.index - 1, 1);
    this.reOrderIndex();
    this.selectedStep = null;
  }

  reOrderIndex() {
    this.droppedSteps.forEach((step, i) => {
      step.index = i + 1;
    });
    this.selectedHeaderStepForComponent = this.droppedSteps[this.selectedIndex - 1];
  }

  canDrop(event: any): boolean {
   console.log("event", event)
    if(event.data.m){
      return true;
    }

    return false; // reject unknown types
}


private safeClone(obj: any): any {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return; // skip circular
        seen.add(value);
      }
      if (key === "blueprint") return undefined; // explicitly remove blueprint
      return value;
    })
  );
}

  onStepDrop(e: any, index: number) {
    console.log("e", e, e.dropEffect)
   // Case 1: Rearranging existing step
    if (e.dropEffect === "move") {
    const stepId = e.data.data; // this is the _id you passed

    // find the step by ID
    const currentIndex = this.droppedSteps.findIndex(s => s._id === stepId);

    if (currentIndex > -1) {
      // get the actual step object
      const step = this.droppedSteps[currentIndex];

      // remove old position
      this.droppedSteps.splice(currentIndex, 1);

      // deep clone (safe)
      const clonedStep = step;

      // insert at new position
      if (index >= 0 && index <= this.droppedSteps.length) {
        this.droppedSteps.splice(index, 0, clonedStep);
      } else {
        this.droppedSteps.push(clonedStep);
      }
      console.log("this.droppedSteps", )

      this.reOrderIndex();
    }
    return false;
  }

    if (this.droppedSteps.length >= 6) {
      this.service.showMessage({ message: "You can't add more than 6 step" });
      return;
    }
    const obj = Object.assign({}, e.data.data);
    obj.index = this.droppedSteps.length + 1;
    this.droppedSteps.push(obj);
    // this.droppedSteps = JSON.parse(JSON.stringify(this.droppedSteps));
    this.reOrderIndex();
  }

  sortElement(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.droppedSteps, event.previousIndex, event.currentIndex);
    this.reOrderIndex();
  }


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

  removeAutoFields:any = [];
  onElementDrop(e: any, type?) {
    // console.log("e", e);
 
    // 
    let dragged = e?.data;
   
   console.log("dragged", dragged, this.draggableElements);
   console.log("dragged data", dragged.data, this.droppedSteps, this.selectedIndex);

   if(dragged.data.name && dragged.data.id!='image'){
    let baseName = dragged.data.name; // e.g. "Single Line 1"

      // Remove any trailing number to get the true base name
      baseName = baseName.replace(/\s*\d+$/, '').trim();

      let prevStep = this.droppedSteps[this.selectedIndex - 1];
      if (!prevStep) return;

      let allComponents = prevStep.component || [];

      let matching = allComponents.filter(el =>
        el.instance.data?.name?.replace(/\s*\d+$/, '').trim() === baseName
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
        console.log("allComponents", allComponents);
        // dragged.data['componentName']= allComponents.map(el => el.instance.data.name)
      } else {
        // dragged.data.name = `${baseName} 1`;
      }
   }
  



   let component:any =dragged && dragged.data && dragged.data.component?dragged.data.component: this.draggableElements[dragged.m].items && this.draggableElements[dragged.m].items[dragged.i] && this.draggableElements[dragged.m].items[dragged.i].component ?this.draggableElements[dragged.m].items[dragged.i].component:'';
   if(this.selectedForm){
      component = dragged.data.component;
   }
   if(!component){
    component =this.draggableElements[dragged.m].items[dragged.i].component;
   }
   console.log("component", component);
    dragged['component'] = component
    let maindata = {
      ...dragged.data,
      m:dragged.m,
      i:dragged.i,
      // elementData:{...dragged.data?.elementData},
      component:component
    }
    console.log("maindata", maindata)
    const componentFactory = this.cfr.resolveComponentFactory(component);
    let componentRef: any = this.viewRef.createComponent(componentFactory);
    if (type === 'sort') {
      const obj = Object.assign({}, maindata);
      obj.index = this.droppedSteps[this.selectedIndex - 1].component.length + 1
      componentRef.instance.data = obj;
    } else {
      componentRef.instance.data = {
        id: maindata.id,
        index: this.droppedSteps[this.selectedIndex - 1].component.length + 1,
        name: maindata.name,
        component: maindata.component,
        actionType: "",
        m:maindata.m,
        i:maindata.i,
        isElementWidthFull: maindata.isElementWidthFull ? maindata.isElementWidthFull : maindata.isElementWidthFull  === false ? false: true,
        elementData: maindata.elementData ? maindata.elementData : {},
        logic: maindata.logic ? maindata.logic : {},
        componentName: this.droppedSteps[this.selectedIndex - 1].component.map(el => el.instance.data.name)
      };
      componentRef.instance.allField = this.prepareFormData();
    }
   
    this.droppedSteps[this.selectedIndex - 1].component.push({...componentRef});
    let prev1Step = this.droppedSteps[this.selectedIndex - 1];
    // console.log("prev1Step", prev1Step);
    if (prev1Step && Array.isArray(prev1Step.component)) {
      // Create name list once
      const nameArray = prev1Step.component.map(el => el.instance.data.name);
      //  Assign it to each component
      prev1Step.component.forEach(element => {
        element.instance.data.componentName = nameArray;
      });
    }
    console.log(" this.droppedSteps",  this.droppedSteps)
    this.reorderDroppedItemIndexing();
    componentRef.instance.action.subscribe((result) => {

      if(result.removeData){
        this.removeAutoFields.push({
          link_field_name:result.removeData,
          current_form_id:this.selectedForm._id
        })
        delete result.removeData;
      }
      console.log("result", result);
      if (result.actionType === 'delete') {
         this.deleteResult = result;

         console.log("this.deleteResult", this.deleteResult);
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
         
        // this.deleteAlert.show();
       
        //
      } else {

        // let prevStep = this.droppedSteps[this.selectedIndex - 1];
        // if (!prevStep) return;

        // let allComponents = prevStep.component || [];

        // let matching = allComponents.filter(el =>
        //   el.instance.data.name.replace(/\s*\d+$/, '').trim() === baseName
        // );
        // if (matching.length > 0) {
        //   return false;
        // }
        console.log(result);

        this.droppedSteps.map(el=>{
          el.component.map(e=>{
            console.log("e.instance.data", e.instance.data)
            if(e.instance.data.logic.action == "show_field" || e.instance.data.logic.action === "hide_field"){
              if(e.instance.data.logic.hide_show_field == result.oldname || result.oldname != result.name){
                e.instance.data.logic.hide_show_field  = result.name;
                this.updateLogic.push(e.instance.data.logic)
              }
            }else{
              if(result.oldname != result.name && (e.instance.data.logic._id  || e.instance.data.logic.logic_id)){
                e.instance.data.logic.field_name  = result.name;
                this.updateLogic.push(e.instance.data.logic)
              }
            }
          })
        })

        this.viewRef.clear(); 
        console.log("this.droppedSteps", this.droppedSteps, this.updateLogic);

        
        // this.droppedSteps.forEach(step=>{
        //   step.component.forEach(item => {
        //     const newFactory = this.cfr.resolveComponentFactory(item.instance.constructor);
        //     componentRef = this.viewRef.createComponent(newFactory);
        //     componentRef.instance.action = item.instance.action;
        //     componentRef.instance.data = item.instance.data;
        //     componentRef.instance.data.actionType = '';
        //     componentRef.instance.allField = this.prepareFormData();
        //   });
        // })
        this.droppedSteps[this.selectedIndex - 1].component.forEach(item => {
          const newFactory = this.cfr.resolveComponentFactory(item.instance.constructor);
          componentRef = this.viewRef.createComponent(newFactory);
          componentRef.instance.action = item.instance.action;
          componentRef.instance.data = item.instance.data;
          componentRef.instance.data.actionType = '';
          componentRef.instance.allField = this.prepareFormData();
        });
        this.cdr.detectChanges();
      }
    });
  }
  removeComponent(element: any, status = '') {
    console.log("element", element)
    this.viewRef.remove(element.index - 1);
    this.droppedSteps[this.selectedIndex - 1].component.splice(element.index - 1, 1);
    this.reorderDroppedItemIndexing();
    this.cdr.detectChanges();  // Trigger change detection if needed
    if(status=='remove'){
        this.saveMultiPageForm('save-remove');
    }
  }

  reorderDroppedItemIndexing() {
    this.droppedSteps[this.selectedIndex - 1].component.forEach((item, i) => {
      item.instance.data.index = i + 1;
    });
    this.cdr.detectChanges();  // Trigger change detection if needed
    
  }

  sortDroppedElement(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.droppedSteps[this.selectedIndex - 1].component, event.previousIndex, event.currentIndex);
    this.sort();
  }

  sort() {
    const items = this.droppedSteps[this.selectedIndex - 1].component;
    console.log("items", items)
    this.droppedSteps[this.selectedIndex - 1].component = [];
    this.viewRef.clear();
    items.forEach(item => {
      // const obj = { dragData: item.instance.data };
       let obj = { data: item.instance.data };
        obj['m'] = item.instance.data.m;
        obj['i'] = item.instance.data.i;
        console.log("obj", obj)
      this.onElementDrop({data:obj}, 'sort');
    });
  }

  openMultiStepPreviewForm() {
    this.multiStepFormPreviewData = this.droppedSteps;
    
    this.previewMultiStepPageModal.show();
  }

  closeMultiStepPreviewModal() {
    this.previewMultiStepPageModal.hide();
  }

  prepareFormData() {
    let formSteps: any = [];
    this.droppedSteps.forEach(step => {
      const formStep = {
        color: step.color,
        component: [],
        index: step.index,
        name: step.name,
        _id: step._id,
         permissions: {   // plural
            student: { read: step?.permissions?.student?.read },
            employer: { read:  step?.permissions?.employer?.read }
          },
        componentName: this.droppedSteps[this.selectedIndex - 1].component.map(el => el.instance.data.name)
      };
      step.component.forEach(item => {
        const data = {
       elementData: item.instance?.data?.elementData &&
             Object.keys(item.instance.data.elementData).length > 0
  ? item.instance.data.elementData
  : {
      ...(item.instance?.data?.elementData || {}),
      value: ""
    },

          logic:item.instance.data.logic,
          id: item.instance.data.id,
          index: item.instance.data.index,
          name: item.instance.data.name,
          isElementWidthFull: item.instance.data.isElementWidthFull,
         
        }
        formStep.component.push(data);
      });
      formSteps.push(formStep);
    });
    return formSteps;
  }

  getSubmitterLetter() {
    return this.submitters.find(sub => sub.name === this.selectedSubmitter)?.letter.toLocaleLowerCase();
  }

  checked: any = false;
  autoRenewal:any = false;
  hcaaf_validation:any = 12
  autoFeilds:any = [];
  async saveMultiPageForm(type='') {
    if (this.droppedSteps.length === 0) {
      return;
    }
    this.multi_step = this.prepareFormData();

    const html_template = document.getElementById('html_template')?.innerHTML;
    const payload: any = {
      title: this.formName,
      widgets: { html: html_template, values: this.multi_step },
      submiters: this.getSubmitterLetter(),
      type: 'multi_step',
      'is_hcaaf': this.checked,
      'form_type':this.form_type,
      "is_autoRenewal":this.autoRenewal,
      hcaaf_validation:this.hcaaf_validation
    }
    if (this.selectedForm?._id || this.findForm?._id) {
      payload._id =this.findForm?._id?this.findForm?._id: this.selectedForm._id;
    }

    console.log("payload", payload);
    // return false;
    this.isSuccess = false;
    this.service.createForm(payload).subscribe(async(res: any) => {
      if(type=='save-remove'){

      }else if(type=='save'){

        console.log("res.data", res, res.data);

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
       
   
      }else{
        await this.multi_step.map(async el=>{
          if(el.component.length>0){
          await el.component.forEach(e=>{
              if(e.elementData.Autofill && e.elementData.field){
                this.autoFeilds.push({
                  name:e.elementData.title,
                  alias:e.elementData.alias?e.elementData.alias:'',
                  link_table:e.elementData.alias? e.elementData.Autofill: "",
                  link_form_id:e.elementData.Autofill,
                  link_field_name: e.elementData.field,
                  current_form_id: this.selectedForm && this.selectedForm._id? this.selectedForm._id:res?.data?._id,
                  current_field_name:e.elementData.title,
                  'type':'multi_step'
                });
            }
            })
          }
        })
      
        console.log("this.updateLogic", this.updateLogic);
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
            message: "Multi-step form created successfully"
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
    console.log("data, id", data, id)
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


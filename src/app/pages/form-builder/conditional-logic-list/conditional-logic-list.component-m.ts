import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import moment from 'moment';
import { LoaderService } from '../../../loaderservice.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-conditional-logic-list',
  templateUrl: './conditional-logic-list.component.html',
  styleUrls: ['./conditional-logic-list.component.scss']
})
export class ConditionalLogicListComponent implements OnInit {
  jobSkills: any = [];
  essentials: FormGroup;
  routeForm: FormGroup;
  selectedJobSkills: any = [];
  selectedCompany: any = {};
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  @ViewChild('addLogicForm') addLogicForm: ModalDirective;
  @ViewChild('alreadyLogicModel') alreadyLogicModel: ModalDirective;
  @ViewChild('removeLogicModel') removeLogicModel: ModalDirective;
  
  
  
  limitOffset = {
    limit: this.paginationObj.pageSize,
    offset: this.paginationObj.pageIndex
  }
 
  companiesList: any = [];
  displayedColumns: string[] = [
    'Section',
    'FieldName',
    'FieldType',
    'IS',
    'Value',
    'Action'
  ]

  numbers:any= [
    { label: 'Equals', value: 'eq', sign: '=' },
    { label: 'Not Equals', value: 'neq', sign: '≠' },
    { label: 'Less Than', value: 'lt', sign: '<' },
    { label: 'Greater Than', value: 'gt', sign: '>' },
    { label: 'Less Than or Equal To', value: 'lte', sign: '≤' },
    { label: 'Greater Than or Equal To', value: 'gte', sign: '≥' },
  ]
  dates:any= [
    { label: 'Before', value: 'lt', sign: '<' },
    { label: 'After', value: 'gt', sign: '>' },
    { label: 'On or Before', value: 'lte', sign: '≤' },
    { label: 'On or After', value: 'gte', sign: '≥' },
  ];
  times:any= [
    { label: 'Before', value: 'lt', sign: '<' },
    { label: 'After', value: 'gt', sign: '>' },
    { label: 'On or Before', value: 'lte', sign: '≤' },
    { label: 'On or After', value: 'gte', sign: '≥' },
  ]
  dropdowns:any= [
    { label: 'Includes', value: 'includes', sign: '∈' },
    { label: 'Does Not Include', value: 'not_includes', sign: '∉' },
    { label: 'Equals', value: 'eq', sign: '=' },   // single option
  ];
  radios:any= [
    { label: 'Includes', value: 'includes', sign: '∈' },
    { label: 'Does Not Include', value: 'not_includes', sign: '∉' },
    { label: 'Equals', value: 'eq', sign: '=' },   // single option
  ];
  checkboxs:any = [
    { label: 'Includes', value: 'includes', sign: '∈' },
    { label: 'Does Not Include', value: 'not_includes', sign: '∉' },
    { label: 'Equals', value: 'eq', sign: '=' },   // single option
  ];
  likerts:any = [
    { label: 'Equals', value: 'eq', sign: '=' },
    { label: 'Not Equals', value: 'neq', sign: '≠' },
    { label: 'Less Than', value: 'lt', sign: '<' },
    { label: 'Greater Than', value: 'gt', sign: '>' },
    { label: 'Less Than or Equal To', value: 'lte', sign: '≤' },
    { label: 'Greater Than or Equal To', value: 'gte', sign: '≥' },
  ];
  texts:any= [
    { label: 'Equals Characters Count', value: 'eq', sign: '=' },
    { label: 'Less Than Characters Count', value: 'lt', sign: '<' },
    { label: 'Greater Than Characters Count', value: 'gt', sign: '>' },
    { label: 'Less Than or Equal To Characters Count', value: 'lte', sign: '≤' },
    { label: 'Greater Than or Equal To Characters Count', value: 'gte', sign: '≥' },
  ]
  Actions:any =   [
      { value: 'show_field', label: 'Show Field' },
      { value: 'hide_field', label: 'Hide Field' },
      { value: 'show_message', label: 'Show Message' },
      { value: 'block_submission', label: 'Block Submission & Show Message' },
      // { value: 'end_process', label: 'End Form Process & Show Message' },
    ];
  logicForm:FormGroup;


  constructor(private service: TopgradserviceService, private router: Router, private fb: FormBuilder, 
    private ngxPermissionService: NgxPermissionsService, private cdRef: ChangeDetectorRef, private loader: LoaderService, private location: Location, private activatedRoute: ActivatedRoute) { }

  FormId:any = '';

  getLabel(type: string, value: string): string {
    let options: any[] = [];

    switch (type) {
      case 'number':
        options = this.numbers;
        break;
      case 'date':
        options = this.dates;
        break;
      case 'time':
        options = this.times;
        break;
      case 'dropdown':
        options = this.dropdowns;
        break;
      case 'radio':
        options = this.radios;
        break;
      case 'checkbox':
        options = this.checkboxs;
        break;
      case 'likert':
        options = this.likerts;
        break;
      case 'text':
        options = this.texts;
        break;
      case 'single':
        options = this.texts;
      case 'multi':
        options = this.texts; // ✅ example grouping
        break;
      default:
        return value; // fallback
    }


    // console.log("options", options, "value", value);
    return options.find(op => op.value === value)?.label || value;
  }

  ngOnInit(): void {
  
    this.logicForm = this.fb.group({
    field_name: ['', Validators.required],
    page_type: [''],
    action_page_type: [''],
    is: [''],
    value: [''],
    action: ['', Validators.required],
    section: [''],
    section_field_name: [''],
    show_message: [false],
    message: [''],
    and_number: [''],
    to_number: [''],
    number_grather: [''],
    hide_show_field: [''],
    type: ['']
  });

  this.logicForm.get('field_name')?.valueChanges.subscribe(value => {
    this.setType();
  });

  this.logicForm.get('field_name')?.valueChanges.subscribe(val => {
    this.setValidatorsBasedOnField(val);
  });

  this.logicForm.get('action')?.valueChanges.subscribe(val => {
    this.setValidatorsBasedOnAction(val);
    this.setPageTypeValidators();  // ✅ handle page_type & action_page_type
  });

  this.logicForm.get('show_message')?.valueChanges.subscribe(val => {
    if (val) {
      this.logicForm.get('message')?.setValidators([Validators.required]);
    } else {
      this.logicForm.get('message')?.clearValidators();
    }
    this.logicForm.get('message')?.updateValueAndValidity();
  });
   this.setPageTypeValidators();  // initialize once
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.FormId = params.id;
        this.getFormById(params.id);
      }
    });
  }

  private setPageTypeValidators() {
    const pageTypeCtrl = this.logicForm.get('page_type');
    const actionPageTypeCtrl = this.logicForm.get('action_page_type');
    const action = this.logicForm.get('action')?.value;

    if (this.selectedForm?.type === 'multi_step') {
      // If multi-step, always require page_type
      pageTypeCtrl?.setValidators([Validators.required]);

      // If action requires page, enforce action_page_type too
      if (action === 'show_field' || action === 'hide_field') {
        actionPageTypeCtrl?.setValidators([Validators.required]);
      } else {
        actionPageTypeCtrl?.clearValidators();
      }
    } else {
      // Not multi_step → no validators needed
      pageTypeCtrl?.clearValidators();
      actionPageTypeCtrl?.clearValidators();
    }

    pageTypeCtrl?.updateValueAndValidity();
    actionPageTypeCtrl?.updateValueAndValidity();
  }

  //  getData(fieldName: string) {
  //   return this.fieldList.find(f => f.name === fieldName);
  // }

  setValidatorsBasedOnField(fieldName: string) {
    const field = this.getData(fieldName);

    // clear all first
    ['is','value','and_number','to_number','number_grather']
      .forEach(ctrl => {
        this.logicForm.get(ctrl)?.clearValidators();
        this.logicForm.get(ctrl)?.updateValueAndValidity();
      });

    if (!field) return;

    switch (field.id) {
      case 'date':
      case 'time':
      case 'dropdown':
      case 'radio':
      case 'likert':
      case 'checkbox':
        this.logicForm.get('is')?.setValidators([Validators.required]);
        this.logicForm.get('value')?.setValidators([Validators.required]);
        break;

      case 'number':
        this.logicForm.get('is')?.setValidators([Validators.required]);
        this.logicForm.get('and_number')?.setValidators([Validators.required]);
        // "to_number" required only for a specific operator
        break;

      case 'single':
      case 'multi':
        this.logicForm.get('is')?.setValidators([Validators.required]);
        this.logicForm.get('value')?.setValidators([Validators.required]);
        break;
    }

    ['is','value','and_number','to_number','number_grather']
      .forEach(ctrl => this.logicForm.get(ctrl)?.updateValueAndValidity());
  }

  setValidatorsBasedOnAction(action: string) {
    this.logicForm.get('hide_show_field')?.clearValidators();
    this.logicForm.get('message')?.clearValidators();

    if (action === 'show_field' || action === 'hide_field') {
      this.logicForm.get('hide_show_field')?.setValidators([Validators.required]);
    }

    if (['show_message','block_submission','end_process'].includes(action)) {
      this.logicForm.get('message')?.setValidators([Validators.required]);
    }

    this.logicForm.get('hide_show_field')?.updateValueAndValidity();
    this.logicForm.get('message')?.updateValueAndValidity();
  }


onPageTypeChange(event: any) {
  console.log("Selected value:", event); // gives you the full selected object/value
  this.fieldList  = [];
  let find = this.selectedForm.widgets.values.find(el=>el.name==event);
  console.log("find", find)
  if(find){
     find.component.forEach(el=>{
          if(el.id != "description" && el.id != "attachment" && el.id != "downloadable" && el.id != "image"){
            this.fieldList.push(el);
          }
      })

      console.log("this.fieldList", this.fieldList)
  }
  this.cdRef.detectChanges();

}


onPageTypeChange1(event: any) {
  console.log("Selected value:", event); // gives you the full selected object/value
  this.fieldList2  = [];
  let find = this.selectedForm.widgets.values.find(el=>el.name==event);
  if(find){
    
     find.component.forEach(el=>{
          if(el.id != "description" && el.id != "attachment" && el.id != "downloadable" && el.id != "image"){
            // this.fieldList.push(el);
            this.fieldList2.push(el)
          }
      })
  }
  this.cdRef.detectChanges();
}

  selectedForm:any=null;
  fieldList:any = [];
  fieldList2:any = [];
  getFormById(id) {
    this.service.getFormById({ _id: id }).subscribe((response: any) => {
      console.log("response", response);  
      if(response.code ==200){
        this.selectedForm = response.data[0];
        
        if(this.selectedForm.type==="multi_step"){
          // this.selectedForm.widgets.values.forEach(el=>{
          //   el.component.forEach(e=>{
          //     if(e.id != "description" && el.id != "attachment" && el.id != "downloadable" && el.id != "image"){
          //       this.fieldList.push(e)
          //     }
          //   })
          // });
          // console.log("this.fieldList", this.fieldList);
        }else{
          this.selectedForm.widgets.values.forEach(el=>{
              if(el.id != "description" && el.id != "attachment" && el.id != "downloadable" && el.id != "image"){
                this.fieldList.push(el);
                this.fieldList2.push(el)
              }
          })
          console.log("this.fieldList", this.fieldList);
        }
        
      }else{
        this.selectedForm = null
      }  
    });
      this.getCompaniesList();
  }

  selectedField:any = {}
  getData(value){
     this.selectedField = this.fieldList.find(el=>el.name==value);
     return this.selectedField;
  }

  getCompaniesList() {
    const payload = {
      "form_id": this.FormId,
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    }
    this.loader.show();
    this.service.getFormConditionalLogic(payload).subscribe(async(response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length = response.count;
        this.companiesList = response.data;
        this.loader.hide();
      } else {
        this.companiesList = [];
          this.loader.hide();
      }
    },(err)=>{
      this.companiesList = [];
        this.loader.hide();
    })
  }


  getPaginationData(event) {
    this.paginationObj = event;
    this.getCompaniesList();
    // if(this.searchForm)  {
    //   this.searchForms();
    // }else {
    //   if(this.filterList && this.filterList.length>0){
    //     this.filterForms();
    //   }else{
    //     this.getAllForms();
    //   }
    // }
    // this.selectedForms = {};
    
  }

  AddLogic(){
    if (this.logicForm.valid) {
      console.log('Form submitted:', this.logicForm.value, this.selectedForm);
      // return false;
     
      this.createFormLogic();
      
    } else {
      this.logicForm.markAllAsTouched();
    }
  }



   async saveMultiPageForm() {
    const payload: any = {
      _id: this.selectedForm._id,
      widgets: this.selectedForm.widgets
    }
    if (this.selectedForm?._id) {
      payload._id = this.selectedForm._id;
    }
    this.service.createForm(payload).subscribe(async(res: any) => {
       this.getFormById(this.FormId);
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  editLogicdata:any = null
  async editLogic(data){
    this.editLogicdata =await data;
    console.log("this.editLogicdata", this.editLogicdata)

    // this.logicForm.patchValue({
    //   ...this.editLogicdata,
    //   value: Array.isArray(this.editLogicdata.value) 
    //           ? this.editLogicdata.value[0] 
    //           : this.editLogicdata.value
    // });

    await this.onPageTypeChange(data?.page_type)
    if(data?.action_page_type){
      await this.onPageTypeChange1(data?.action_page_type);
    }
    


   await this.logicForm.patchValue({
      ...this.editLogicdata,
      value: Array.isArray(this.editLogicdata.value) 
              ? this.editLogicdata.value 
              : this.editLogicdata.value
    });

    console.log("this.logicForm", this.logicForm)

    this.addLogicForm.show();

  }

  goBack() {
    if(this.selectedForm.type==="multi_step"){
    this.router.navigate(
    ['/admin/form-builder/multi-step-form'],
    { queryParams: { id: this.FormId } }
    );
    }else if(this.selectedForm.type==="simple"){
      this.router.navigate(
    ['/admin/form-builder/single-page-form'],
    { queryParams: { id: this.FormId } }
    );
    }else{
        this.location.back();
    }
    //  admin/form-builder/multi-step-form?id=689adfcb0d2eef04a1ae301e
    // this.location.back();
  }

  setType(){
      if(this.logicForm.value.field_name){
        let find = this.fieldList.find(el=>el.name == this.logicForm.value.field_name);
        console.log("find", find)
        if(find){
          this.logicForm.patchValue({
            type:find.id
          })
        }
      }
  }
  // createFormLogic() {
  //   let payload = {
  //     form_id: this.selectedForm._id,
  //     ...this.logicForm.value
  //   }
  //   if(this.editLogicdata && this.editLogicdata._id){
  //     payload['_id'] = this.editLogicdata._id;
  //   }


  //   // console.log("payload", payload, this.selectedForm);
  //   // return false;
  //   this.service.createFormLogic(payload).subscribe(async(res: any) => {
  //      this.editLogicdata = null;
  //      if(res.status==200){
  //         if (this.selectedForm.type === "multi_step") {
  //           this.selectedForm.widgets.values.forEach(async(el) => {
  //             await el.component.forEach(async(e) => {
  //               // Skip specific field types
  //               if (!["description", "attachment", "downloadable", "image"].includes(e.id)) {
  //                 if (this.logicForm.value.field_name === e.name && this.logicForm.value.page_type === el.name) {

  //                   // Initialize logic array if not present
  //                   if (!Array.isArray(e.logic)) {
  //                     e.logic = [];
  //                   }

  //                   // If editing, replace old logic with updated one
  //                   const existingIndex =await e.logic.findIndex(
  //                     (l: any) => l._id === payload._id
  //                   );

  //                   if (existingIndex !== -1) {
  //                      el.logic[existingIndex] = { ...this.logicForm.value };
  //                   } else {
  //                      el.logic.push({ ...this.logicForm.value }); // <--- push copy
  //                   }

  //                   this.logicForm.value.type = e.id;
  //                 }
  //               }
  //             });
  //           });

  //           this.saveMultiPageForm();
  //           this.addLogicForm.hide();
  //           this.ngOnInit();
  //           console.log("Updated Multi-Step Form:", this.selectedForm);
  //           // return  false;
  //         }

  //         // Handle single-step form
  //         else {
  //           this.selectedForm.widgets.values.forEach(el => {
  //             if (!["description", "attachment", "downloadable", "image"].includes(el.id)) {
  //               if (this.logicForm.value.field_name === el.name) {

  //                 // Initialize logic array if not present
  //                 if (!Array.isArray(el.logic)) {
  //                   el.logic = [];
  //                 }

  //                 // If editing, replace the existing logic
  //                 const existingIndex = el.logic.findIndex(
  //                   (l: any) => l._id === payload._id
  //                 );

  //                 if (existingIndex !== -1) {
  //                     el.logic[existingIndex] = { ...this.logicForm.value };
  //                 } else {
  //                     el.logic.push({ ...this.logicForm.value }); // <--- push copy
  //                 }


  //                 this.logicForm.value.type = el.id;
  //               }
  //             }
  //           });

  //           this.saveMultiPageForm();
  //           this.addLogicForm.hide();
  //           this.ngOnInit();
  //           console.log("Updated Single-Step Form:", this.selectedForm);
  //         }
      
  //      }else if(res.status == 409){
  //       this.addLogicForm.hide();
  //       this.ngOnInit();
  //       this.alreadyLogicModel.show();
  //      }
  //     //  this.getFormById(this.FormId);
  //   }, err => {
  //     this.service.showMessage({
  //       message: err.msg ? err.msg : 'Something went Wrong'
  //     });
  //   });
  // }

  

async createFormLogic() {
  const payload: any = {
    form_id: this.selectedForm._id,
    ...this.logicForm.value
  };

  if (this.editLogicdata && this.editLogicdata._id) {
    payload._id = this.editLogicdata._id;
  }

  try {
    // 1️⃣ Call API to create/update logic
    const res: any = await firstValueFrom(this.service.createFormLogic(payload));

    if (res.status === 200) {
      this.editLogicdata = null;

      // 2️⃣ Update local form logic array
      if (this.selectedForm.type === "multi_step") {
        for (const el of this.selectedForm.widgets.values) {
          for (const e of el.component) {
            if (!["description", "attachment", "downloadable", "image"].includes(e.id)) {
              if (
                this.logicForm.value.field_name === e.name &&
                this.logicForm.value.page_type === el.name
              ) {
                if (!Array.isArray(e.logic)) e.logic = [];
                console.log("el.logic", el.logic)
                const existingIndex = e.logic.findIndex((l: any) => l.field_name === payload.field_name && l.is === payload.is);
                console.log("existingIndex", existingIndex);
                if (existingIndex !== -1) {
                  e.logic[existingIndex] = { ...this.logicForm.value };
                } else {
                  e.logic.push({ ...this.logicForm.value });
                }

                // this.logicForm.value.type = e.id;
              }
            }
          }
        }
      } else {
        for (const el of this.selectedForm.widgets.values) {
          if (!["description", "attachment", "downloadable", "image"].includes(el.id)) {
            if (this.logicForm.value.field_name === el.name) {
              if (!Array.isArray(el.logic)) el.logic = [];

              const existingIndex = el.logic.findIndex((l: any) => l.field_name === payload.field_name && l.is === payload.is);
              if (existingIndex !== -1) {
                el.logic[existingIndex] = { ...this.logicForm.value };
              } else {
                el.logic.push({ ...this.logicForm.value });
              }

              // this.logicForm.value.type = el.id;
            }
          }
        }
      }

      // 3️⃣ Save form
     await this.saveMultiPageForm();

      // 4️⃣ Close modal and refresh
      this.addLogicForm.hide();
      this.ngOnInit();

      console.log("✅ Form logic updated:", this.selectedForm);
    } else if (res.status === 409) {
      // Logic already exists
      this.addLogicForm.hide();
      this.ngOnInit();
      this.alreadyLogicModel.show();
    }
  } catch (err: any) {
    console.error("❌ Error creating form logic:", err);
    this.service.showMessage({
      message: err.msg ? err.msg : "Something went wrong"
    });
  }
}

async removeForm() {
  try {
    if (this.selectedForm.type === "multi_step") {
      this.selectedForm.widgets.values.forEach(el => {
        el.component.forEach(e => {
          if (!["description", "attachment", "downloadable", "image"].includes(e.id)) {
            if (
              this.editLogicdata.field_name === e.name &&
              this.editLogicdata.page_type === el.name
            ) {
              // Remove matching logic entry
              if (Array.isArray(e.logic)) {
  // Find the index of the logic object to remove
                const index = e.logic.findIndex((l: any) => 
                  l.field_name === this.editLogicdata.field_name && l.is === this.editLogicdata.is
                );

                if (index !== -1) {
                  // Remove the object at that index
                  e.logic.splice(index, 1);
                }

                // If array is empty, delete the logic property
                if (e.logic.length === 0) delete e.logic;
              } 
              else if (e.logic && e.logic.field_name === this.editLogicdata.field_name) {
                delete e.logic;
              }
            }
          }
          // e.logic = [];
        });
      });

      // Wait for async save
      await this.saveMultiPageForm();
      console.log("✅ Multi-step form updated:", this.selectedForm);
    } 
    else {
      this.selectedForm.widgets.values.forEach(el => {
        if (!["description", "attachment", "downloadable", "image"].includes(el.id)) {
          if (this.editLogicdata.field_name === el.name) {
            if (Array.isArray(el.logic)) {
              const index = el.logic.findIndex((l: any) =>
                l.field_name === this.editLogicdata.field_name && l.is === this.editLogicdata.is
              );

              if (index !== -1) {
                el.logic.splice(index, 1);
              }

              if (el.logic.length === 0) delete el.logic;
            } 
            else if (el.logic && el.logic.field_name === this.editLogicdata.field_name) {
              delete el.logic;
            }
          }
        }
      });

      // Wait for async save
      await this.saveMultiPageForm();
      console.log("✅ Single-step form updated:", this.selectedForm);
    }

    // Optional: reinitialize or show success message
    this.ngOnInit();
    this.service.showMessage({ message: 'Logic removed successfully!' });

  } catch (err) {
    console.error('❌ Error removing logic:', err);
    this.service.showMessage({ message: 'Failed to remove logic. Please try again.' });
  }
}

removeLogic(){

  console.log("this.editLogicdata", this.editLogicdata, this.selectedForm);
  this.removeForm();
  // return false;

    const payload = {
      _id: this.editLogicdata._id,
    }
    this.service.removeFormLogic(payload).subscribe(async(res: any) => {
       this.editLogicdata = null;
       this.removeLogicModel.hide()
       this.getCompaniesList();
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

formatRowValue(row: any): string {
  if (!row) return '';

  // Case 1: Date type
  if (row.type === 'date' && row.value) {
    const date = new Date(row.value);
    return date.toLocaleDateString('en-GB'); // dd/MM/yyyy
  }

  // Case 2: Array value
  if (Array.isArray(row.value)) {
    return row.value.join(', ');
  }

  // Case 3: String value (comma-separated)
  if (typeof row.value === 'string') {
    return row.value.split(',').join(', ');
  }

  // Case 4: Fallback to numbers (if present)
  if (row.and_number !== undefined && row.to_number !== undefined) {
    return `${row.and_number} - ${row.to_number}`;
  }

  return row.and_number?.toString() || '';
}



}


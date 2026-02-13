import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { log } from 'console';
import { MatRadioModule } from '@angular/material/radio';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from '../../topgradservice.service';
import SignaturePad from 'signature_pad';
import { Router } from '@angular/router';
// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgxPermissionsService } from 'ngx-permissions';
import * as $ from "jquery";
import { HttpResponseCode } from '../../shared/enum';
import { LoaderService } from '../../loaderservice.service';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { MatStepper } from '@angular/material/stepper';



@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss'],
})
export class MyTaskComponent implements OnInit {
  @ViewChild('selectResumeLevel') public selectResumeLevel: ModalDirective;
  @ViewChild('previewVideoInterview') public previewVideoInterview: ModalDirective;
  @ViewChild('confirmationDelete') public confirmationDelete: ModalDirective;

  

  @ViewChild('sendEmailOpen') sendEmailOpen;
  @ViewChild('closeRminderModal') closeRminderModal;
checked:boolean = false;
  userForm: FormGroup;
  activeFilter: string = null;
  dragging: boolean = false;
  resume_level = null;
  taskList = null;
  copyfile:boolean = false;
  sortingOrder = {
    assigned_tasks: false,
    in_progress_tasks: false,
    completed_tasks: false,
    to_do: false,
    approve: false,
    declined: false
  }
  assignedAllSelected: boolean = false;
  inProgressAllTasks: boolean = false;
  completedTasks: boolean = false;
  Company:boolean = true;
  Student:boolean = true;
  selectColor($event: any) {
    // this stops the menu from closing
    $event.stopPropagation();
    $event.preventDefault();

    // in this case, the check box is controlled by adding the .selected class
    if ($event.target) {
      $event.target.classList.toggle('selected');
    }
  }
  filters = {
    PLACEMENT_GROUP: 'placement_group',
    MAJOR: 'major',
    STUDENT_NAME: 'student_name',
    STATUS: 'status',
    ASSIGNED_TO: 'assigned_to',
    UPLOAD_DATE: 'upload_date',
    PRIORITY: 'priority',
    WORKFLOW: 'workflow',
    COURSE_CODE: 'course_code'
  }

  action = {
    BULK: 'bulk',
    CANCEL: 'cancel'
  }
  selectedIndex = 2;
  selectedRecords:any = [];
  toggleBulkAction = {
    bulkAction: true,
    cancel: false
  }
  disabledActionItems: boolean = true;
  moveCandidatesTo: string = null;
  moveCandidateSteps = {
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed'
  }

  selectedTask:any = null;
  comment = "";
  searchKeyword = null;
  signaturePads: SignaturePad[] = [];
  @ViewChild('canvas') canvas: ElementRef;
  signaturesArray: any = [1, 2, 3, 4, 5];
  isWILWritePermission = false;

  constructor(private fb: FormBuilder, private service: TopgradserviceService,
     private router: Router, private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef, private loaderService:LoaderService, private fileIconService:FileIconService, private sanitizer: DomSanitizer) {
    this.userForm = this.fb.group({});
  }
 getSafeSvg(documentName: string): SafeHtml {
   return this.fileIconService.getFileIcon(documentName);
  }


  ngOnInit(): void {
    this.activeFilter = this.filters.PLACEMENT_GROUP;
    this.getAllTasks(true);
    this.getAllApprovalTaskCount(true);

    this.getAllReminders(false);

  }

  filter_approvals = {
    all: false,
    documents: false,
    allDocuments: false,
    resume: false,
    coverLetter: false,
    payslips: false,
    offerLetter: false,
    visa: false,
    passport: false,
    driversLicense: false,
    others: false,
    forms: false,
  };

  filter_reminder:any = {
    student: false,
    company: false,
  }


  openMail(){
    document.getElementById("sendEmailOpen")?.click();
  }
  onMenuItemClick(event: MouseEvent): void {
    // Close the menu explicitly
    // if (menuTrigger) {
    //   menuTrigger.closeMenu();
    // }
    event.stopPropagation();
    // Additional logic if needed
    // console.log('Menu item clicked and menu closed.');
  }
  
  // onFilterChange(filterName: string, event: any): void {
  //   // Log the state of the filter change

  //   // Implement filter logic here (e.g., update UI or trigger backend calls)

  //   console.log("event.checked", event.checked, this.filter_approvals[filterName], filterName);
  //   this.filter_approvals[filterName] = event.checked;

  //   console.log("this.filter_approvals", this.filter_approvals);

  //   // // If 'All' checkbox is checked, ensure all relevant filters are updated
  //   if (filterName === 'all') {
  //     this.filterObjectApprovls.task_type = [];
  //     this.filterObjectApprovls.document_types = [];
  //     Object.keys(this.filter_approvals).forEach(key => {
  //       if (key !== 'all') {
  //         this.filter_approvals[key] = false;
  //       }
  //     });
  //   }else{
  //     this.filter_approvals['all'] = false;
  //   }

  //   // // // If 'All' checkbox is unchecked, uncheck all the other relevant filters
  //   // if (filterName === 'all' && !event.checked) {
  //   //   Object.keys(this.filter_approvals).forEach(key => {
  //   //     if (key !== 'all') {
  //   //       this.filter_approvals[key] = false;
  //   //     }
  //   //   });
  //   // }

  //   if(!event.checked){
  //     Object.keys(this.filter_approvals).forEach(key => { 


  //       if(key == "resume"){
  //         // this.filterObjectApprovls.document_types.push("Resume");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Resume");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "coverLetter"){
  //         // this.filterObjectApprovls.document_types.push("Cover Letter");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Cover Letter");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "payslips"){
  //         // this.filterObjectApprovls.document_types.push("Payslips");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Payslips");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "offerLetter"){
  //         // this.filterObjectApprovls.document_types.push("Offer Letter");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Offer Letter");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "visa"){
  //         // this.filterObjectApprovls.document_types.push("Visa");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Visa");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "passport"){
  //         // this.filterObjectApprovls.document_types.push("Passport");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Passport");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "driversLicense"){
  //         // this.filterObjectApprovls.document_types.push("Driver's License");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Driver's License");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "others"){
  //         // this.filterObjectApprovls.document_types.push("Others");
  //         let find = this.filterObjectApprovls.document_types.indexOf("Others");
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }else if(key == "allDocuments" || key=="documents"){
  //         // this.filterObjectApprovls.document_types.push("Resume");
  //       }else{
  //         let find = this.filterObjectApprovls.document_types.indexOf(filterName);
  //         if(find){
  //           this.filterObjectApprovls.document_types.splice(find, 1);
  //         }
  //       }


  //       // if(key===filterName){
  //       //   let find = this.filterObjectApprovls.document_types.indexOf(filterName);
  //       //   if(find){
  //       //     this.filterObjectApprovls.document_types.splice(find, 1);
  //       //   }
  //       // }
  //     });
  //   }

  //   Object.keys(this.filter_approvals).forEach(key => {
  //       if (this.filter_approvals[key] && key != "all") {
  //         if(key == "allDocuments" || key == "documents" || key == "resume" || key == "coverLetter" || key == "payslips" || key == "offerLetter" || key == "visa" || key == "passport" || key == "driversLicense" || key == "others"){
  //           if(!this.filterObjectApprovls.task_type.includes("attachments")){
  //             this.filterObjectApprovls.task_type.push("attachments");
  //           }
  //         }
  //         if(key == "forms"){
  //           if(!this.filterObjectApprovls.task_type.includes("form")){
  //             this.filterObjectApprovls.task_type.push("form");
  //           }
  //         }
  //         if(!this.filterObjectApprovls.document_types.includes(key)){

  //           if(key == "resume"){
  //             this.filterObjectApprovls.document_types.push("Resume");
  //           }else if(key == "coverLetter"){
  //             this.filterObjectApprovls.document_types.push("Cover Letter");
  //           }else if(key == "payslips"){
  //             this.filterObjectApprovls.document_types.push("Payslips");
  //           }else if(key == "offerLetter"){
  //             this.filterObjectApprovls.document_types.push("Offer Letter");
  //           }else if(key == "visa"){
  //             this.filterObjectApprovls.document_types.push("Visa");
  //           }else if(key == "passport"){
  //             this.filterObjectApprovls.document_types.push("Passport");
  //           }else if(key == "driversLicense"){
  //             this.filterObjectApprovls.document_types.push("Driver's License");
  //           }else if(key == "others"){
  //             this.filterObjectApprovls.document_types.push("Others");
  //           }else if(key == "allDocuments" || key=="documents"){
  //             // this.filterObjectApprovls.document_types.push("Resume");
  //           }else{
  //             this.filterObjectApprovls.document_types.push(key);
  //           }
           
  //         }
  //       }

  //       if(key == "all" && this.filter_approvals[key]){
  //         this.filter_approvals[key] = false;
  //         this.filterObjectApprovls.task_type = [];
  //         this.filterObjectApprovls.document_types = [];
  //       }
  //   });
  //   if(this.searchKeyword){
  //     this.searchMyTask();
  //   }else{
  //     this.getAllTasks(true);
  //   }
  // }
  
  onFilterChange(filterName: string, event: any): void {
    console.log("event.checked", event.checked, this.filter_approvals[filterName], filterName);
    this.filter_approvals[filterName] = event.checked;
    console.log("this.filter_approvals", this.filter_approvals);

    if (filterName === "all") {
      console.log("come if all")
      // Reset all filters when 'All' is checked
      this.filterObjectApprovls.task_type = [];
      this.filterObjectApprovls.document_types = [];
      Object.keys(this.filter_approvals).forEach(key => {
        if (key !== "all") this.filter_approvals[key] = false;
      });
    } else {
      this.filter_approvals["all"] = false;
    }
  
    if (!event.checked) {
      console.log("come false");
    
      const documentTypeMapping: Record<string, string> = {
        resume: "Resume",
        coverLetter: "Cover Letter",
        payslips: "Payslips",
        offerLetter: "Offer Letter",
        visa: "Visa",
        passport: "Passport",
        driversLicense: "Driver's License",
        others: "Others"
      };
    
      // Remove unchecked document type
      if (documentTypeMapping[filterName]) {
        const index = this.filterObjectApprovls.document_types.indexOf(documentTypeMapping[filterName]);
        if (index !== -1) {
          this.filterObjectApprovls.document_types.splice(index, 1);
        }
      }
    
      // If document_types is empty, remove "attachments" from task_type
      if (this.filterObjectApprovls.document_types.length === 0) {
        const taskIndex = this.filterObjectApprovls.task_type.indexOf("attachments");
        if (taskIndex !== -1) {
          this.filterObjectApprovls.task_type.splice(taskIndex, 1);
        }
      }


      if (!event.checked) {
        const formIndex = this.filterObjectApprovls.task_type.indexOf("form");
        this.filterObjectApprovls.task_type.splice(formIndex, 1);
      }
    }
    
  
    Object.keys(this.filter_approvals).forEach(key => {
      if (this.filter_approvals[key] && key !== "all") {
        
        // Ensure "attachments" is added only once
        if (
          ["allDocuments", "documents", "resume", "coverLetter", "payslips", "offerLetter", "visa", "passport", "driversLicense", "others"].includes(key)
        ) {
          if (!this.filterObjectApprovls.task_type.includes("attachments")) {
            this.filterObjectApprovls.task_type.push("attachments");
          }
        }
    
        // Ensure "form" is added only once
        if (key === "forms" && !this.filterObjectApprovls.task_type.includes("form")) {
          this.filterObjectApprovls.task_type.push("form");
        }

        // if (key === "forms" && !this.filterObjectApprovls.task_type.includes("form")) {
        //   this.filterObjectApprovls.task_type.push("form");
        // }
 
        // if (!event.checked) {
        //   const formIndex = this.filterObjectApprovls.task_type.indexOf("form");
        //   this.filterObjectApprovls.task_type.splice(formIndex, 1);
        // }
    
        // Mapping of keys to document types
        const documentTypeMapping: Record<string, string> = {
          resume: "Resume",
          coverLetter: "Cover Letter",
          payslips: "Payslips",
          offerLetter: "Offer Letter",
          visa: "Visa",
          passport: "Passport",
          driversLicense: "Driver's License",
          others: "Others"
        };
    
        // Check if the mapped document type already exists before pushing
        const mappedValue = documentTypeMapping[key];
    
        if (
          mappedValue &&
          !this.filterObjectApprovls.document_types.some(type => type.toLowerCase() === mappedValue.toLowerCase())
        ) {
          this.filterObjectApprovls.document_types.push(mappedValue);
        }
      }
    });
    
  
    if (this.filter_approvals["all"]) {
      console.log("come all")
      this.filter_approvals["all"] = false;
      this.filterObjectApprovls.task_type = [];
      this.filterObjectApprovls.document_types = [];
    }
  
    if (this.searchKeyword) {
      this.searchMyTask();
    } else {
      this.getAllTasks(true);
    }
  }

  
  filterObjectReminder:any={}

  onFilterChangeReminder(filterName: string, event: any): void {
    // Log the state of the filter change

    // Implement filter logic here (e.g., update UI or trigger backend calls)
    this.filter_reminder[filterName] = event.checked;

    // if(!event.checked){
    //  this.filterObjectReminder.filterName = false;
    // }

    // Object.keys(this.filter_reminder).forEach(key => {
    //   if(this.filter_reminder[key]){
    //     if (key == "student") {
    //       this.filterObjectReminder.student = true;
    //     }else{
    //       this.filterObjectReminder.company = true;
    //     }
    //   }
    // });
    this.getAllReminders(true);
  }
  


  filterObjectApprovls:any={
    document_types:[]
  };


  getSelectedTask(task?, currentTask?) {
    this.selectedTask = null;
    this.selectedTask = { ...task, ...currentTask };
    this.selectedReminder = null
    this.selectedRecords = { ...task, ...currentTask };
   
   
    console.log("this.selectedRecords", this.selectedRecords);

    if(this.selectedTask.task_type === 'Video'){
      this.ratings = [
        { label: 'Communication & Coherence',name: 'Communication', value: 0 },
        { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
        { label: 'Skills',name: 'Skills', value: 0 },
        { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
        { label: 'Relevance & Content', name: 'Relevance', value: 0 },
      ];
      this.updateRecords();
    }
      // if (this.studentFormDetail?.type === 'simple') {
      //   this.singleStepForm = this.studentFormDetail?.widgets?.values;
      //   this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));

      // } else if (this.studentFormDetail?.type === 'multi_step') {
      //   this.multiStepForm = this.studentFormDetail?.widgets?.values;
      //   this.multiStepForm.forEach(el=>{
      //      el.component.forEach(field => this.manageFieldVisibility(field, el.component));
      //   })
       
      // }

    if(this.selectedTask.form_fields?.type == "multi_step"){
      this.selectedTask?.form_fields?.fields.map(el=>{
        // console.log("el", el);
        el.component.map(e=>{
          if(e.id=="single" || e.id=="multi"){
            // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
            e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
            ? e.elementData.value.replace(/�/g, '') 
            : e.elementData.value;
          }
          if(e.id=="yes_no"){
              if(e.elementData.value==true){
                e.elementData.value = 'Yes';
              }else{
                e.elementData.value = 'No';
              }
          }
        })
        el.component.forEach(field => this.manageFieldVisibility(field, el.component));
      })
      // this.multiStepForm.forEach(el=>{
      //      el.component.forEach(field => this.manageFieldVisibility(field, el.component));
      //   })
    }else{
      if(this.selectedTask?.form_fields && this.selectedTask?.form_fields?.fields){
        this.selectedTask?.form_fields?.fields.map(e=>{
          if(e.id=="single" || e.id=="multi"){
            // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
            e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
            ? e.elementData.value.replace(/�/g, '') 
            : e.elementData.value;
          }
          if(e.id=="yes_no"){
            if(e.elementData.value==true){
              e.elementData.value = 'Yes';
            }else{
              e.elementData.value = 'No';
            }
        }
      })

      this.selectedTask?.form_fields?.fields.forEach(field => this.manageFieldVisibility(field, this.selectedTask?.form_fields?.fields));
      }
      
    }
    this.comment = "";
    this.selectedTask.selected = true;
    this.getSelectedRecords();
  }

  openVideo(){
    this.ratings = [
      { label: 'Communication & Coherence',name: 'Communication', value: 0 },
      { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
      { label: 'Skills',name: 'Skills', value: 0 },
      { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
      { label: 'Relevance & Content', name: 'Relevance', value: 0 },
    ];
    this.updateRecords();
  }

  searchMyAllocation(){
    this.getAllocations();
  }

  searchMyTask() {
    if(this.selectedIndex==3){
      this.getAllReminders(false);
      return false;
    }
    if(this.searchKeyword.length==0){
      this.getAllTasks(this.selectedIndex === 1 ? false : true);
      return false;
    }

    console.log("this.filter_approvals", this.filter_approvals);

    let payload = {
      is_approve: this.selectedIndex === 1 ? false : true,
      keyword: this.searchKeyword
    }
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    console.log("userDetail", userDetail);
    if(userDetail.sub_type=='admin'){

    }else{
      payload['staff_id'] = [userDetail._id] ;
      // };
    }
    this.uncheckAll();
    if(this.selectedIndex === 2 && this.filterObjectApprovls && this.filterObjectApprovls.document_types.length>0){
      payload = {
        ...payload,
        ...this.filterObjectApprovls  // Correct spread syntax
      }
    }
    this.service.searchMyTask(payload).subscribe(res => {
      this.taskList = res;
    });
  }

  taskCounts:any;
  getAllApprovalTaskCount(isApprove){
    let payload = {
      is_approve: isApprove
    }
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    if(userDetail.sub_type=='admin'){

    }else{
      payload['staff_id'] = [userDetail._id] ;
      // };
    }
    this.service.getMyTasksCount(payload).subscribe(res => {
      this.taskCounts = res;
    });
  }

  uncheckAll() {
    for (const key in this.filter_approvals) {
      if (this.filter_approvals.hasOwnProperty(key)) {
        this.filter_approvals[key] = false;
        this.cdr.detectChanges();
      }
    }
    this.cdr.detectChanges(); // Ensure the UI is updated
  }

  allocationList:any ;
  getAllocations(){
    let payload ={};
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    console.log("userDetail", userDetail);
    if(userDetail.sub_type=='admin'){
      payload['staff_id'] = userDetail._id;
      payload['user_type'] = userDetail.sub_type;
    }else{
      payload['staff_id'] = userDetail._id;
      payload['user_type'] = userDetail.sub_type;
      // };
    }
   if(this.searchKeyword){
     payload['search'] = this.searchKeyword;
   }

     this.service.getStaffAllocations(payload).subscribe(res => {
      console.log("res", res)
      this.allocationList = res;
      let task = this.allocationList?.assigned?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.allocationList?.in_progress?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.allocationList?.completed?.find(task => task._id === this.selectedTask?._id);
      // if (task) {
      //   this.selectedTask = task;
      // }else{
      //    this.selectedTask =null;
      // }
    });

  }

  getAllTasks(isApprove) {
    let payload = {
      is_approve: isApprove
    }
 
   
    if (isApprove) {
      payload = {
        is_approve: isApprove,
        ...this.filterObjectApprovls  // Correct spread syntax
      };
    }
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    console.log("userDetail", userDetail);
    if(userDetail.sub_type=='admin'){

    }else{
      payload['staff_id'] = [userDetail._id] ;
      // };
    }
    if(this.searchKeyword){

      this.searchMyTask();

      return false;
      payload = {
        ...payload,
        ...{keyword: this.searchKeyword}
      };
    }
    console.log("payload", payload);
    this.loaderService.show();
    this.service.getMyTasks(payload).subscribe(res => {
      this.taskList = res;
      let task = this.taskList?.to_do?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.taskList?.approve?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.taskList?.declined?.find(task => task._id === this.selectedTask?._id);
      this.loaderService.hide();
      console.log("task", task)
      if (task || this.selectedTask) {
        this.selectedTask = task || this.selectedTask;
      }else{
         this.selectedTask =null;
      }
    }, (err)=>{
      this.loaderService.hide();
    });
  }

 

  btnTabs(index: number) {
    this.selectedIndex = index;
    this.hidekabab = false;
    this.disabledActionItems = false;
    if (this.selectedIndex === 1) {
      this.getAllocations();
      // this.getAllTasks(false);
      // this.getAllApprovalTaskCount(false);
    } else if (this.selectedIndex === 2) {
      this.getAllTasks(true);
      this.getAllApprovalTaskCount(true);
    }else{
      this.getAllReminders(true);
    }
  }
  closeResumeLevelPopup() {
    this.selectResumeLevel.hide();
    if (this.selectedIndex === 1) {
      this.getAllTasks(false);
      this.getAllApprovalTaskCount(false);
    } else {
      this.getAllTasks(true);
      this.getAllApprovalTaskCount(true);
    }
  }
  toggleAction(btnAction: string) {
    if (btnAction == this.action.BULK) {
      this.toggleBulkAction.bulkAction = false;
      this.toggleBulkAction.cancel = true;
    } else {
      this.toggleBulkAction.bulkAction = true;
      this.toggleBulkAction.cancel = false;
      this.assignedAllSelected = false;
      this.inProgressAllTasks = false;
      this.completedTasks = false;
      this.taskList?.assigned_tasks.forEach(task => {
        task['selected'] = false;
      });
      this.taskList?.completed_tasks.forEach(task => {
        task['selected'] = false;
      });
      this.taskList?.in_progress_tasks.forEach(task => {
        task['selected'] = false;
      });
    }
  }

  onClicItem(task) {
    task.selected = !task.selected;
    this.checkAnyItemSelected()
  }

  selectAllTask(type) {
    if (type === 'assigned_tasks') {
      this.assignedAllSelected = !this.assignedAllSelected;
    } else if (type === 'in_progress_tasks') {
      this.inProgressAllTasks = !this.inProgressAllTasks;
    } else {
      this.completedTasks = !this.completedTasks;
    }
    this.taskList[type].forEach(task => {
      if (this.assignedAllSelected || this.inProgressAllTasks || this.completedTasks) {
        task['selected'] = true;
        this.disabledActionItems = false;
      } else {
        this.disabledActionItems = true;
        task['selected'] = false;
      }
    });
    this.checkAnyItemSelected();
  }

  checkAnyItemSelected() {
    let assigned, inProgress, completed, toDo, approved, declined, in_progress;
    if (this.selectedIndex === 2) {
      toDo = this.taskList.to_do.find((task) => task.selected == true);
      approved = this.taskList.approve.find((task) => task.selected == true);
      declined = this.taskList.declined.find((task) => task.selected == true);
    }else  if (this.selectedIndex === 1) {
      assigned = this.allocationList.assigned.find((task) => task.selected == true);
      in_progress = this.allocationList.in_progress.find((task) => task.selected == true);
      completed = this.allocationList.completed.find((task) => task.selected == true);
    } else {
      assigned = this.taskList.assigned_tasks.find((task) => task.selected == true);
      inProgress = this.taskList.in_progress_tasks.find((task) => task.selected == true);
      completed = this.taskList.completed_tasks.find((task) => task.selected == true);
    }
    if (assigned || inProgress || completed || toDo || approved || declined || in_progress) {
      this.disabledActionItems = false;
    } else {
      this.disabledActionItems = true;
    }
    this.getSelectedRecords();
  }

  getSelectedRecords() {
    let filteresSelectedTask = [];
    if (this.selectedIndex === 2) {
      const filterTodoTask = this.taskList.to_do.filter(task => task.selected);
      const filterApproveTask = this.taskList.approve.filter(task => task.selected);
      const filterDeclinedTask = this.taskList.declined.filter(task => task.selected);
      filteresSelectedTask = [...filterTodoTask, ...filterApproveTask, ...filterDeclinedTask];
    }else if (this.selectedIndex === 1) {
      const filterTodoTask = this.allocationList.assigned.filter(task => task.selected);
      const filterApproveTask = this.allocationList.in_progress.filter(task => task.selected);
      const filterDeclinedTask = this.allocationList.completed.filter(task => task.selected);
      filteresSelectedTask = [...filterTodoTask, ...filterApproveTask, ...filterDeclinedTask];
    } else {
      const filterAssignedTask = this.taskList.assigned_tasks.filter(task => task.selected);
      const filterInProgressTask = this.taskList.in_progress_tasks.filter(task => task.selected);
      const filterCompletedTask = this.taskList.completed_tasks.filter(task => task.selected);
      filteresSelectedTask = [...filterAssignedTask, ...filterInProgressTask, ...filterCompletedTask];
      //Check if all task selected;
      if (this.taskList.assigned_tasks.length) {
        this.assignedAllSelected = filterAssignedTask.length == this.taskList.assigned_tasks.length ? true : false;
      }
      if (this.taskList.in_progress_tasks.length) {
        this.inProgressAllTasks = filterInProgressTask.length == this.taskList.in_progress_tasks.length ? true : false;
      }
      if (this.taskList.assigned_tasks.length) {
        this.completedTasks = filterCompletedTask.length == this.taskList.assigned_tasks.length ? true : false;
      }
    }
    this.selectedRecords = filteresSelectedTask;
  }

  async drop(event: CdkDragDrop<string[]>, status) {
    console.log("eventeventevent", event)
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('My_Tasks_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      return;
    }
    this.dragging = true;    
    if(this.selectedIndex==3){
      if (event.previousContainer === event.container) {
        this.dragging = true;
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this.dragging = false;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.selectedTask = event.container.data[event.currentIndex];
        console.log(" this.selectedTask",  this.selectedTask);
        if (status === 'pending') {
          if (this.selectedTask?.document_types === 'Resume') {
            this.displayResumeLevel();
          } else {
            this.updateReminderStatus(this.selectedTask, status);
          }
        } else {
          // if (status === 'completed') {
          //   document.getElementById("declinedPopup")?.click();
          // } else {
            this.updateReminderStatus(this.selectedTask, status);
          // }
        }
      }
    }else{

    
      // console.log('From index:', event.previousIndex);
      // console.log('To index:', event.currentIndex);

      // console.log('Dragged data:', event.item.data);

      
      // if (event.previousContainer === event.container) {
      //   this.dragging = true;
      //   // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      //   const parentTask = event.item.data.parentTask;
      //   moveItemInArray(
      //     parentTask.tasks,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
      // } else {
      //   this.dragging = false;
      //   transferArrayItem(
      //     event.previousContainer.data,
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex,
      //   );
      //   console.log("event", event, event.container.data[event.currentIndex])
      //   this.selectedTask = event.container.data[event.currentIndex];
      //   this.selectedTask = {...this.selectedTask, ...event?.item?.data?.childTask}
      //   delete this.selectedTask.tasks;
      //   console.log("this.selectedTask?.document_types", this.selectedTask);
      //   if (status === 'approve') {
      //     if(this.selectedTask?.task_type === 'Video' && this.selectedTask?.completion_criteria=='Submit Video (Upload URL)'){
      //       if(this.selectedTask.video_url){
      //         this.safeVideoUrl =await this.getVideoUrl(this.selectedTask);
      //       }
      //       this.previewVideoInterview.show();
      //       event.previousContainer.data.splice(event.previousIndex, 0, this.selectedTask);
      //       event.container.data.splice(event.currentIndex, 1);
      //       return false;
      //     }
      //     if (this.selectedTask?.document_types === 'Resume') {
      //       this.displayResumeLevel();
      //     } else {
      //       this.updateTaskStatus(this.selectedTask, status);
      //     }
      //   } else {
      //     if (status === 'declined') {
      //       document.getElementById("declinedPopup")?.click();
      //     } else {
      //       this.updateTaskStatus(this.selectedTask, status);
      //     }
      //   }
      // }
      const { parentTask, childTask } = event.item.data;

  console.log('From index:', event.previousIndex);
  console.log('To index:', event.currentIndex);
  console.log('Dragged child:', childTask);

  // 🔹 SAME CONTAINER → reorder child
  if (event.previousContainer === event.container) {
    moveItemInArray(
      parentTask.tasks,
      event.previousIndex,
      event.currentIndex
    );
    return;
  }

  const sourceParents = event.previousContainer.data;
  const targetParents = event.container.data;

  const parentIndex = sourceParents.findIndex((p:any) => p._id === parentTask._id);

  // 🔹 CASE 1: Parent has MORE THAN ONE child
  if (parentTask.tasks.length > 1) {

    // 1️⃣ Remove only the dragged child
    parentTask.tasks = parentTask.tasks.filter(
      t => t._id !== childTask._id
    );

    // 2️⃣ Create NEW parent card for drop side
    const newParent = {
      ...parentTask,
      tasks: [childTask]
    };

    targetParents.splice(event.currentIndex, 0, newParent);

  }
  // 🔹 CASE 2: Parent has ONLY ONE child → move whole card
  else {
    transferArrayItem(
      sourceParents,
      targetParents,
      parentIndex,
      event.currentIndex
    );
  }

  // 🔹 Status handling
  this.selectedTask = {
    ...parentTask,
    ...childTask
  };
  delete this.selectedTask.tasks;

  if (status === 'approve') {

    if (
      this.selectedTask.task_type === 'Video' &&
      this.selectedTask.completion_criteria === 'Submit Video (Upload URL)'
    ) {
      if (this.selectedTask.video_url) {
        this.safeVideoUrl = await this.getVideoUrl(this.selectedTask);
      }
      this.previewVideoInterview.show();
      return;
    }

    if (this.selectedTask.document_types === 'Resume') {
      this.displayResumeLevel();
    } else {
      this.updateTaskStatus(this.selectedTask, status);
    }

  } else if (status === 'declined') {
    document.getElementById('declinedPopup')?.click();
  } else {
    this.updateTaskStatus(this.selectedTask, status);
  }
    }
   
  }


  async dropAllocation(event: CdkDragDrop<string[]>, status) {
    console.log("eventeventevent", event)
    this.isWILWritePermission = await this.ngxPermissionService.hasPermission('My_Tasks_Write');
    if (!this.isWILWritePermission) {
      this.service.showMessage({message: 'permission not allowed'});
      return;
    }
    this.dragging = true;    
    if (event.previousContainer === event.container) {
      this.dragging = true;
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.dragging = false;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log("event", event, event.container.data[event.currentIndex])
      this.selectedTask = event.container.data[event.currentIndex];
      console.log("this.selectedTask?.document_types", this.selectedTask);
      // if (status === 'approve') {
      //   if(this.selectedTask?.task_type === 'Video' && this.selectedTask?.completion_criteria=='Submit Video (Upload URL)'){
      //     if(this.selectedTask.video_url){
      //       this.safeVideoUrl =await this.getVideoUrl(this.selectedTask);
      //     }
      //     this.previewVideoInterview.show();
      //     event.previousContainer.data.splice(event.previousIndex, 0, this.selectedTask);
      //     event.container.data.splice(event.currentIndex, 1);
      //     return false;
      //   }
      //   if (this.selectedTask?.document_types === 'Resume') {
      //     this.displayResumeLevel();
      //   } else {
      //     this.updateTaskStatus(this.selectedTask, status);
      //   }
      // } 
      this.updateAllocationStatus(this.selectedTask, status);
      // else {
      //   if (status === 'declined') {
      //     document.getElementById("declinedPopup")?.click();
      //   } else {
      //     this.updateTaskStatus(this.selectedTask, status);
      //   }
      // }
    }
   
  }

  checApproveTaskIsResume() {
    if (this.selectedTask?.document_types === 'Resume') {
      this.displayResumeLevel();
    } else {
      this.approveSingleTask('approve');
    }
  }

  displayResumeLevel() {
    this.resume_level = 'A';
    this.selectResumeLevel.show();
  }

  updateAllocationStatus(event, status) {
    // if (status === 'approve' && event?.staff_status !== 'completed' && event.task_type === 'form') {
    //   this.service.showMessage({
    //     message: "Staff approval required."
    //   });
    //   this.getAllTasks(true);
    //   return;
    // }

    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let payload = {
      student_id: event?.student_id,
      status:status
    }

    // if(status=="to_do"){
    //   payload['move_back_user_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
    //   payload['move_back_date'] = new Date().toISOString();
    //   payload['staff_name'] = '';
    //   payload['move_back'] = true;
    // }

    // if(status=="approve"){
    //   payload['staff_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
    //   payload['staff_submitted_at'] = new Date().toISOString();
    //   payload['move_back_user_name'] = '';
    //   payload['move_back_date'] =new Date().toISOString();
    // }


    this.service.updateStaffAllocationStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task status updated successfully"
      });
      if(status === 'declined'){
         this.comment = '';
      }
      this.getAllocations()
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  updateTaskStatus(event, status) {
    // if (status === 'approve' && event?.staff_status !== 'completed' && event.task_type === 'form') {
    //   this.service.showMessage({
    //     message: "Staff approval required."
    //   });
    //   this.getAllTasks(true);
    //   return;
    // }

    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let payload = {
      status: status,
      declined_by_id: status === 'declined' ? userDetail._id : undefined,
      declined_by_type: status === 'declined' ? userDetail.type : undefined,
      task_id: event.task_id,
      task_type: event.task_type,
      _id: event._id,
      task_status : status === 'declined' ? 'pending':status=="to_do"?'pending': 'completed',
      // task_status : status === 'declined' ? 'pending': event.task_status,
      student_id: event?.student_id,
      comment: status === 'declined' ? this.comment : undefined,
      copyfile:this.copyfile?this.copyfile:false,
      staff_name:userDetail?.first_name + ' ' + userDetail?.last_name,
      staff_status:status === 'declined' ?'pending':'completed',
      student_status:status === 'declined' ?'pending': "completed",
      employee_status: status === 'declined' ?'pending':"completed",
    }

    if(status=="to_do"){
      payload['move_back_user_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
      payload['move_back_date'] = new Date().toISOString();
      payload['staff_name'] = '';
      payload['move_back'] = true;
    }

    if(status=="approve"){
      payload['staff_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
      payload['staff_submitted_at'] = new Date().toISOString();
      payload['move_back_user_name'] = '';
      payload['move_back_date'] =new Date().toISOString();
    }


    this.service.updateTaskStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task status updated successfully"
      });
      if(status === 'declined'){
         this.comment = '';
      }
      if (this.selectedIndex === 1) {
        this.getAllTasks(false);
        this.getAllApprovalTaskCount(false);
      } else {
        this.getAllTasks(true);
        this.getAllApprovalTaskCount(true);
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  applyFilter(filter) {
    this.activeFilter = filter;
  }

  moveToStep(step: string) {
    this.moveCandidatesTo = step;
    this.assignedAllSelected = false;
    this.inProgressAllTasks = false;
    this.completedTasks = false;
  }

  onMoveTo(step: string) {
    // let taskGroup = [];
    // for (const status in this.taskList) {
    //   taskGroup = [...this.taskList[status]];
    //   this.taskList[status].forEach((task)=> {
    //     if (task && task.selected) {
    //       task.selected = false;
    //       this.taskList[step].push(task);
    //       this.removeItem(taskGroup, task, status);
    //     }
    //   });
    // }

    const filterAssignedTask = this.taskList.assigned_tasks.filter(task => task.selected);
    const filterInProgressTask = this.taskList.in_progress_tasks.filter(task => task.selected);
    const filterCompletedTask = this.taskList.completed_tasks.filter(task => task.selected);
    const filteresSelectedTask = [...filterAssignedTask, ...filterInProgressTask, ...filterCompletedTask];
    this.updateBulkTaskStatus(step, filteresSelectedTask);
  }

  approveTask(status) {
    const filterTodoTask = this.taskList.to_do.filter(task => task.selected);
    const filterApproveTask = this.taskList.approve.filter(task => task.selected);
    const filterDeclinedTask = this.taskList.declined.filter(task => task.selected);
    const filteresSelectedTask = [...filterTodoTask, ...filterApproveTask, ...filterDeclinedTask];
  
    // return false;
  
    this.updateBulkTaskStatus(status, filteresSelectedTask);
  }

  approveSingleTask(status) {
    if (status == 'declined') {
      this.updateTaskStatus(this.selectedTask, status);
     
    } else {
      this.selectResumeLevel.hide();
      this.updateBulkTaskStatus(status, [this.selectedTask]);
    }
  }



 async downloadFile() {console.log(this.selectedTask, "this.selectedTask")

    try {
       this.loaderService.show();
      const response = await fetch(this.selectedTask?.attachments?.url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.selectedTask?.attachments?.name;
      link.click();
      window.URL.revokeObjectURL(link.href);
      this.loaderService.hide();
    } catch (error) {
      this.loaderService.hide();
      console.error('There was an error downloading the PDF:', error);
       window.open(this.selectedTask?.attachments?.url);
    }

   
  }

  exportTask(status) {
    let filteresSelectedTask = [];
    if (status === 'allocations') {
      const filterAssignedTask = this.taskList.assigned_tasks.filter(task => task.selected);
      const filterInProgressTask = this.taskList.in_progress_tasks.filter(task => task.selected);
      const filterCompletedTask = this.taskList.completed_tasks.filter(task => task.selected);
      filteresSelectedTask = [...filterAssignedTask, ...filterInProgressTask, ...filterCompletedTask];
    } else {
      const filterTodoTask = this.taskList.to_do.filter(task => task.selected);
      const filterApproveTask = this.taskList.approve.filter(task => task.selected);
      const filterDeclinedTask = this.taskList.declined.filter(task => task.selected);
      filteresSelectedTask = [...filterTodoTask, ...filterApproveTask, ...filterDeclinedTask];
    }
    const payload = {
      task_id: filteresSelectedTask.map(task => task._id)
    }
    this.service.exportTask(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Task exported"
      });
      window.open(res?.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  updateBulkTaskStatus(status, filteresSelectedTask) {
    // const staffApproval = filteresSelectedTask.some(task => task.task_type === 'form' && task.staff_status !== 'completed');
    // if (status === 'approve' && staffApproval) {
    //   this.service.showMessage({
    //     message: "Staff approval required."
    //   });
    //   this.getAllTasks(true);
    //   return;
    // }
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    let payload = {
      task_status :status === 'declined' ? 'pending':'completed',
      status: status,
      comment: status === 'declined' ? this.comment : undefined,
      copyfile: this.copyfile,
      resume_level: this.resume_level ? this.resume_level : undefined,
      task_id: filteresSelectedTask.map(task => task._id),
      student_id: filteresSelectedTask.map(task => task.student_id),
      staff_name:userDetail?.first_name + ' ' + userDetail?.last_name,
      staff_status:status === 'declined' ?'pending':'completed',
      student_status:status === 'declined' ?'pending': "completed",
      employee_status: status === 'declined' ?'pending':"completed",
    }
 

    if(status=="to_do"){
      payload['move_back_user_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
      payload['move_back_date'] = new Date().toISOString();
      payload['staff_name'] = '';
      payload['move_back'] = true;
    }

    if(status=="approve"){
      payload['staff_name'] = userDetail?.first_name + ' ' + userDetail?.last_name;
      payload['staff_submitted_at'] = new Date().toISOString();
      payload['move_back_user_name'] = '';
      payload['move_back_date'] =new Date().toISOString();
    }


    this.service.updateBulkTaskStatus(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task status updated successfully"
      });
      if (status !== 'declined') {
        document.getElementById('fileApprovedPersonSuccess')?.click();
      }
      if (this.selectedIndex === 1) {
        this.getAllTasks(false);
        this.getAllApprovalTaskCount(false);
      } else {
        this.getAllTasks(true);
        this.getAllApprovalTaskCount(true);
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  removeItem(taskGroup, task, status) {
    let index = taskGroup.findIndex(item => item.taskId === task.taskId);
    taskGroup.splice(index, 1);
    this.taskList[status] = taskGroup;
  }

  sorting(key) {
    this.sortingOrder[key] = !this.sortingOrder[key];
    if (this.sortingOrder[key]) {
      this.taskList[key].sort((a, b) => a.updated_at.localeCompare(b.updated_at));
    } else {
      this.taskList[key].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    }
  }

getValueInsideSingleBracket(input: unknown): string[] {
    try {
      if (!input) {
        return [];
      }

      let text = '';

      if (Array.isArray(input)) {
        text = input.join(' ');
      } else if (typeof input === 'string') {
        text = input;
      } else {
        console.warn('Invalid input type:', input);
        return [];
      }

      const regex = /\(([^)]+)\)/g;
      const matches = [...text.matchAll(regex)];

      return matches.map(match => match[1]);
    } catch (error) {
      console.error('getValueInsideSingleBracket error:', error);
      return [];
    }
}
  initializeSign(): void {
    const self = this;
    setTimeout(() => {
      this.signaturePads = [];
      self.initializeSignatures();
    }, 5000);

  }

  initializeSignatures() {
    this.signaturesArray.forEach((signatureData, index) => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
      if (canvas) {
        const signaturePad = new SignaturePad(canvas);
        this.signaturePads.push(signaturePad);
      } else {
        this.signaturePads.push(undefined);
      }
    });
  }

  cancelSignature(i, item) {
    this.signaturePads[i].clear();
    item.signature = {};
    setTimeout(() => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${i}`) as HTMLCanvasElement;
      if (canvas) {
        this.signaturePads[i] = new SignaturePad(canvas);
      }
    }, 1000);
  }

 uploadFile(event, field) {
    const files: FileList = event.target.files;

    if (files[0].size > field?.elementData?.size * 1048576) {
      this.service.showMessage({
        message: 'Please select file less than ' + field?.elementData?.size + ' MB'
      });
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        field.elementData.value = field.elementData.value?.length > 0 ? field.elementData.value : [];
        field.elementData.value.push(resp);
      });
    });

    event.target.value = "";
  }
  getFile(i, item) {
    const dataURL = this.signaturePads[i].toDataURL('image/svg+xml');
    const file = this.dataURLToBlob(dataURL);
    const formData = new FormData();
    formData.append('media', file);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      item.signature = resp;
      this.selectedTask.form_fields.fields[i].signature = resp;
    });
  }

  dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  async submitForm(status?) {
    await this.submitWorkflowttachment(this.selectedTask?.form_fields?.fields, status);
    await this.checApproveTaskIsResume();
  }

  async submitForm12(status?) {
    await this.submitWorkflowttachment(this.selectedTask?.form_fields?.fields, status);
    // await this.checApproveTaskIsResume();
  }

  submitWorkflowttachment(fields, status?) {
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      placement_id: this.selectedTask?.placement_id,
      student_id: this.selectedTask?.student_id,
      task_id: this.selectedTask?.task_id,
      _id: this.selectedTask?._id,
      task_type: this.selectedTask?.task_type,
      staff_status: "completed",
      student_status: "completed",
      employee_status: "completed",
      form_status:'submit',
      form_fields: { fields, type: this.selectedTask?.form_fields?.type },
      form_id: this.selectedTask?.form_id,
      staff_name: userDetail?.first_name + ' ' + userDetail?.last_name,
      ratings:this.ratings.some(r => r.value !== 0)? this.ratings:undefined,
      feedback:this.comment?this.comment:undefined
    }
    this.service.submitStaffWorkFlowForm(payload).subscribe(res => {
      if(status){
        this.checApproveTaskIsResume();
      }else{
         this.service.showMessage({
          message: "Task submitted successfully"
        });
        this.selectedTask.staff_status = 'completed';
        this.getAllTasks(true);
        this.getAllApprovalTaskCount(true);
      }
       
   
  
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  // checkIsFormValid(formFields) {
  //   if (formFields && formFields.length > 0) {
  //     return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
  //       (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
  //       (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
  //   } else {
  //     return true;
  //   }
  //   // return false;
  // }
  checkIsFormValid(formFields) {
  if (formFields && formFields.length > 0) {
    return formFields.some(form => 
      // Case 1: required normal field
      (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||

      // Case 2: signature field
      (form.id === 'signature' && Array.isArray(form.elementData?.items) &&
        form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))) ||

      // Case 3: checkbox field
      (form.id === 'checkbox' && (!Array.isArray(form.elementData?.items) || 
        !form.elementData.items.some(item => item.selected)))
    );
  } else {
    return true;
  }
}


  download(url: string) {
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
      this.download(url);
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
      this.download(url);
    }
  }


  profileDetail:any = {};
  hidekabab:boolean = false;
  getTaskDetailAllocation(data){

      let body = {
        "student_id":data.student_id
      };
      this.selectedTask = data;
  
      this.service.getStaffAllocationDetails(body).subscribe(res => {
        if(res.status==200){
          this.hidekabab = true;
          this.profileDetail = res.data[0];
        }else{
          this.profileDetail = {};
        }
      }, err => {
        this.profileDetail = {};
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
  }


  getTaskDetail(data){

    if(this.selectedIndex == 3){
      // data.type=="student"?data.student_id : 
      let body = {
        "type":data.type,
        "_id":  data._id
      };
      console.log("data", data);
      data['FirstName'] =data.student_name.split(' ')[0];
      data['LastName'] =data.student_name.split(' ')[1];
      data['email_id'] =data.type == "student"?data.student_email:data.company_email;
      this.selectedReminder = data;
      this.service.remindersDetails(body).subscribe(res => {
        if(res.status==200){
          this.profileDetail = res.data[0];
        }else{
          this.profileDetail = {};
        }
  
      }, err => {
        this.profileDetail = {};
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }else{
      let body = {
        "student_id":data.student_id,
        "task_id": data._id
      };
        this.selectedTask = data;
  
      this.service.taskDetails(body).subscribe(res => {
        if(res.status==200){
          this.profileDetail = res.data[0];
        }else{
          this.profileDetail = {};
        }
      }, err => {
        this.profileDetail = {};
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
   
  }

  @ViewChild('closeTaskProfileModal') closeTaskProfileModal

  gotoProfile(){
    this.closeTaskProfileModal.ripple.trigger.click();
    this.hidekabab = false;
    this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: this.profileDetail.student_id}});
  }

  gotoProfileAllocation(){
    this.closeTaskProfileModal.ripple.trigger.click();
    this.hidekabab = false;
     this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: this.selectedReminder.student_id}});
  }

  gotoProfilebyType(){
    console.log("this.selectedReminder", this.selectedReminder)
    if(this.selectedReminder.type=='student'){
      this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: this.selectedReminder.student_id}});
    }else{
      this.router.navigate(["/admin/wil/view-company-details"], {queryParams: {company_id: this.selectedReminder.company_id}});
    }
  }

  gotoProfilebyType1(data){
    this.closeRminderModal.ripple.trigger.click();
    this.hidekabab = false;
    if(data.type=='student'){
      this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: data.student_id}});
    }else{
      this.router.navigate(["/admin/wil/view-company-details"], {queryParams: {company_id: data.company_id}});
    }
  }



  //reminders


  getSelectedReminderRecords() {
    let filteresSelectedTask = [];


    // let task = this.reminderList?.assigned?.find(task => task._id === this.selectedTask?._id);
    //   task = task ? task : this.reminderList?.pending?.find(task => task._id === this.selectedTask?._id);
    //   task = task ? task : this.reminderList?.completed?.find(task => task._id === this.selectedTask?._id);


    const filterAssignedTask = this.reminderList.assigned.filter(task => task.selected);
    const filterInProgressTask = this.reminderList.pending.filter(task => task.selected);
    const filterCompletedTask = this.reminderList.completed.filter(task => task.selected);
    filteresSelectedTask = [...filterAssignedTask, ...filterInProgressTask, ...filterCompletedTask];
    //Check if all task selected;
    if (this.reminderList.assigned.length) {
      this.assignedAllSelected = filterAssignedTask.length == this.reminderList.assigned.length ? true : false;
    }
    if (this.reminderList.pending.length) {
      this.inProgressAllTasks = filterInProgressTask.length == this.reminderList.pending.length ? true : false;
    }
    if (this.reminderList.completed.length) {
      this.completedTasks = filterCompletedTask.length == this.reminderList.completed.length ? true : false;
    }
    this.selectedRecords = filteresSelectedTask;
  }



  // dropReminder(event: CdkDragDrop<string[]>, status) {
  //   this.dragging = true;

  //   console.log("event", event);
  //   if (event.previousContainer === event.container) {
  //     this.dragging = true;
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     this.dragging = false;
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //     this.selectedTask = event.container.data[event.currentIndex];
  //     if (status === 'pending') {
  //       if (this.selectedTask?.document_types === 'Resume') {
  //         this.displayResumeLevel();
  //       } else {
  //         this.updateReminderStatus(this.selectedTask, status);
  //       }
  //     } else {
  //       if (status === 'completed') {
  //         document.getElementById("declinedPopup")?.click();
  //       } else {
  //         this.updateReminderStatus(this.selectedTask, status);
  //       }
  //     }
  //   }
  // }


  updateReminderStatus(event, status) {
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      "_id": event._id,
      "status": status,
      "status_updated_by":userDetail._id 
    }
    this.service.updateRemindersStatus(payload).subscribe(res => {
      if(res.status==200){
        this.service.showMessage({
          message: res.msg
        });
        this.getAllReminders(true);
      }else{
        this.service.showMessage({
          message: res.msg
        });
      }
     
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  reminderList:any = [];
  reminderCounts:any;
  selectedReminder:any;
  getAllReminders(isApprove) {
    let payload = {
      // is_approve: isApprove
      search_keyword:this.searchKeyword?this.searchKeyword:"",
    }

  

    if(this.filter_reminder.student && this.filter_reminder.company){
      payload["type"] =  ["company", "student"];
    }else if(this.filter_reminder.student){
      payload["type"] =  ["student"];
    }else if(this.filter_reminder.company){
      payload["type"] =  ["company"];
    }


    this.service.getReminders(payload).subscribe(res => {
      this.reminderList = res;
      this.reminderCounts = res;
      let task = this.reminderList?.assigned?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.reminderList?.pending?.find(task => task._id === this.selectedTask?._id);
      task = task ? task : this.reminderList?.completed?.find(task => task._id === this.selectedTask?._id);
      if (task) {
        this.selectedReminder = task;
      }
    });
  }

  allocationdata(data){
    console.log("task", data)
    this.selectedReminder = data;
    this.selectedReminder.email = data.email?data.email:data.email_id;
    this.selectedReminder.first_name = data.FirstName;
    this.selectedReminder.last_name = data.LastName;
    this.selectedReminder.type = 'student';
    // if(task.type == 'student'){
    this.selectedReminder.email_id =data.email?data.email:data.email_id; 
    // }
    this.selectedTask = null;
    this.comment = "";
    this.selectedReminder.selected = true;
  }
  getSelectedReminder(task?) {
    console.log("task", task)
    this.selectedReminder = task;
    this.selectedReminder.email = task.type == 'student'?task.student_email:task.company_email;
    this.selectedReminder.first_name = task.type == 'student'?task.student_name.split(' ')[0]:task.company_email;
    this.selectedReminder.last_name = task.type == 'student'?task.student_name.split(' ')[1]:task.company_email;

    if(task.type == 'student'){
      this.selectedReminder.email_id =task.student_email; 
    }
    this.selectedTask = null;
    this.comment = "";
    this.selectedReminder.selected = true;
    this.getSelectedReminderRecords();
  }


  getData(){
    return this.selectedRecords?this.selectedRecords:this.selectedReminder;
  }

  checkFieldPermission(permissions) {
    if (this.selectedTask && this.selectedTask?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return 'editable';
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    }else{
        return 'editable';
    }
    // return 'editable';
  }

  cleanInput(value: string): string {
    if (!value) return '';
    return value.replace(/�/g, ''); // Remove all occurrences of `�`
  }

  viewProfile(student_id) {
    this.router.navigate(['/admin/wil/view-student-profile'], { queryParams: { id: student_id } });
  }

  // Update the field value dynamically
  updateValue(field: any, value: string): void {
    field.elementData.value = this.cleanInput(value);
  }

  checkDropDownFieldPermission(permissions) {
    // if (this.selectedTask?.staff_status !== 'completed') {
    //   if (permissions?.staff.write && permissions?.staff.read) {
    //     return false;
    //   } else if (!permissions?.staff.write && permissions?.staff.read) {
    //     return true;
    //   } else {
    //     return true;
    //   }
    // }.show
  }

    deleteObj:any =null;
 confirmDetete(index: number, file: any) {
  if (!this.deleteObj) {
    this.deleteObj = {};
  }

  this.deleteObj.index = index;
  this.deleteObj.file = file;
  this.confirmationDelete.show();
}

   deleteFile(index, form) {
        if (!Array.isArray(form)) {
          console.error("❌ Error: form is not an array!", form);
          return;
        }
        if (index < 0 || index >= form.length) {
          console.error("❌ Error: Invalid index!", index);
          return;
        }
    
        this.service.deleteFileS3({file_url:form[index].url}).subscribe(res => {
          if (res.status == HttpResponseCode.SUCCESS) {
        
            console.log("🗑️ Deleting file:", form[index]);
            form.splice(index, 1);
            console.log("✅ Updated form:", form);
            this.deleteObj =null;
            this.confirmationDelete.hide();
          } else {
            this.service.showMessage({
              message: res.msg
            });
          }
        }, err => {
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        })
      
      }

      openResume(data){
       window.open(data.resume.url);
      }

      openResumeAtt(data){
       window.open(data.attachments.url);
      }

    getVideoUrl(data):SafeResourceUrl | null {
      if(data && data.video_url){
         // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
          const youtubeMatch = data.video_url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          );
          if (youtubeMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
          }

          // Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
          const vimeoMatch = data.video_url.match(
            /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
          );
          if (vimeoMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
          }
      }else{
          return null;
      }

    }



  formSubmitted:boolean = false
  @ViewChild('closeForm') closeForm;
  onNextOrSubmit(data, stepper: MatStepper, type) {
  console.log("data", data);

   let fields = data?.component?data?.component:data;
   console.log("fields", fields);
  // Determine access level helper
  const getAccessLevel = (permissions) => {
    if (permissions?.staff?.write && permissions?.staff?.read) {
      return 'editable';
    } else if (!permissions?.staff?.write && permissions?.staff?.read) {
      return 'readOnly';
    } else {
      return 'hidden';
    }
  };

  // Skip validation if all fields are just descriptions
  const onlyDescriptions = fields.every(
  field => field.elementData?.type === 'description'
);

if (onlyDescriptions) {
  if (this.selectedTask.form_fields?.type === 'multi_step') {
    const steps = this.selectedTask.form_fields?.fields || [];
    const findIndex = steps.findIndex(f => f.name === data.name);

    console.log('findIndex', findIndex);

    const isLastStep = findIndex === steps.length - 1;

    // 🔹 NOT last step → move next
    if (!isLastStep && findIndex > -1) {
      const mfields = steps[findIndex + 1];
      console.log('mfields', mfields);

      mfields?.component.forEach(field => {
        this.checkFieldLogic(field, mfields?.component);
      });

      stepper.next();
      return;
    }

    // 🔹 LAST step → submit
    if (isLastStep) {
       stepper.selectedIndex = 0;
      this.submitForm12('done');
      return;
    }
  }

  // fallback
  stepper.next();
  return;
}

  fields.forEach(field => {
        this.checkFieldLogic(field, fields)
    });

  // Validate only editable + required fields
  const isInvalid = fields.some(field => {
    const accessLevel = getAccessLevel(field.elementData?.permissions);
    const isEditable = accessLevel === 'editable'; // only check editable fields
    const isRequired = field.elementData?.required;
    const isDescription = field.elementData?.type === 'description';
       const isHidden = field.hidden === true; // check if field is hidden

    if (!isEditable || isDescription || !isRequired || isHidden) {
      return false; // skip validation if not editable, not required, or description
    }

    // Now check value based on type
    const hasValue = field.elementData?.type === 'checkbox'
      ? field.elementData?.items?.some(item => item.selected)
      : !!field.elementData?.value;

    return !hasValue;
  });

  console.log("isInvalid", isInvalid);

   if (isInvalid || this.stopnext || this.disbaledBtnLogic || this.processEnd) {
    this.formSubmitted = true;
    return false;
  } else {
    this.formSubmitted = false;
    if (type === "submit") {
      console.log("submit");
      this.closeForm.ripple.trigger.click();
      // jquery('#previewMultiStepPageModal').modal('hide');
      // return false;
      stepper.selectedIndex = 0;
      this.submitForm12('done');
      // this.submitdisabled = true;
    } else {

      if (this.selectedTask.form_fields?.type === 'multi_step') {
      const findIndex =this.selectedTask.form_fields?.fields.findIndex(f => f.name === data.name);
        console.log("findIndex", findIndex);

        if (findIndex > -1 && findIndex + 1 < this.selectedTask.form_fields?.fields.length) {
          let mfields = this.selectedTask.form_fields?.fields[findIndex + 1];
          console.log("mfields", mfields);
          mfields?.component.forEach(field => {
            // if(!field.elementData.value){
              this.checkFieldLogic(field, mfields?.component)
            // }
          });
        }
      }
      stepper.next();
    }
  }
}


      isAnyItemSelected(items: any[]): boolean {
        return items?.some(item => item.selected);
      }
    isFieldInvalid(field): boolean {
      const access = this.checkFieldPermission(field.elementData?.permissions);
      const isEditable = access === 'editable';
      const isRequired = field.elementData?.required;

      let hasValue = false;

      if (field.elementData?.type === 'checkbox') {
        hasValue = this.isAnyItemSelected(field.elementData?.items);
      } else if (field.elementData?.type === 'attachment') {
        hasValue = field.elementData?.value && field.elementData?.value.length > 0;
      } else {
        hasValue = !!field.elementData?.value;
      }

      return this.formSubmitted && isEditable && isRequired && !hasValue;
    }


  ratings = [
    { label: 'Communication & Coherence',name: 'Communication', value: 0 },
    { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
    { label: 'Skills',name: 'Skills', value: 0 },
    { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
    { label: 'Relevance & Content', name: 'Relevance', value: 0 },
  ];

   // Chart labels
  public radarChartLabels: string[] = this.ratings.map(r => r.name);

//   public radarChartOptions: ChartOptions<'radar'> = {
//   responsive: true,
//   scales: {
//     r: {
//       ticks: {
//         display: false // hide numbers (0,1,2,3,4,5)
//       },
//       pointLabels: {
//         display: true // keep axis labels
//       }
//     }
//   }
// };

  // Radar chart data
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        data: this.ratings.map(r => r.value),
        label: 'Ratings',
        fill: true,
        backgroundColor: 'rgba(63,81,181,0.2)',  // transparent blue
        borderColor: '#3f51b5',                  // blue border
        pointBackgroundColor: '#3f51b5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3f51b5'
      }
    ]
  };

  public radarChartType: ChartType = 'radar';

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        ticks: {
          display: false // hide numbers (0,1,2,3,4,5)
        },
        angleLines: { color: '#e5e5e5' },
        grid: { color: '#f2f2f2' },
        pointLabels: { 
          color: '#333',
          font: { size: 12 }
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Color logic based on value
  getColor(value: number): string {
    if (value === 1) return '#E57373';   // red
    if (value === 2) return '#FBC02D';   // yellow
    if (value > 2) return '#3F51B5';     // blue
    return '#E57373'; // grey for 0
  }

  // Update chart when sliders move
  updateChart() {
    this.radarChartData.datasets[0].data = this.ratings.map(r => r.value);
    this.radarChartData = { ...this.radarChartData }; // trigger change detection
    this.is_rating = false;
      this.calculateOverallRating();
  }
  is_rating:boolean = false;
  async updateRecords(){
    this.ratings = this.selectedTask.ratings?this.selectedTask.ratings:this.ratings;
    this.comment = this.selectedTask?.feedback?this.selectedTask?.feedback:'';
    this.updateChart();
     this.is_rating = false;
     if(this.selectedTask.video_url){
      this.safeVideoUrl =await this.getVideoUrl(this.selectedTask);
     }
   
    this.previewVideoInterview.show()
  }

  overallRating = 0;



calculateOverallRating() {
  if (!this.ratings || this.ratings.length === 0) {
    this.overallRating = 0;
    return;
  }

  const total = this.ratings.reduce((sum, item) => sum + (item.value || 0), 0);
  this.overallRating = +(total / this.ratings.length).toFixed(1);
}


safeVideoUrl:any = '';
  async submitVideoInterview() {
      console.log(this.ratings,"ratings");
      const hasNonZero = this.ratings.some(r => r.value !== 0);
      if (hasNonZero) {
        await this.submitWorkflowttachment(this.selectedTask?.form_fields?.fields);
        await this.checApproveTaskIsResume();
        this.previewVideoInterview.hide();
      } else {
        this.is_rating = true;
        console.log("❌ All ratings are 0");
      }
    return false;
  }


  onCheckboxChange(field) {
  // When user changes a checkbox, re-check validity
  if (field.elementData?.type === 'checkbox') {
    const hasSelected = this.isAnyItemSelected(field.elementData?.items);
    // console.log("hasSelected", hasSelected);
    // If at least one selected, clear error state for this field
    // if (hasSelected) {
    //   field.elementData.value = null;
    //   // field.elementData.required = false;
    // }
     field.elementData.value = hasSelected ? true : null;
  }
}

  errorMessage:any = null;
  processEnd:boolean = false;
  processEndObj:any = null;
  disbaledBtnLogic:boolean = false;
  stopnext:boolean = false;


checkFieldLogic(changedField: any, fields: any[]) {
  console.log("changedField, fields", changedField, ' == = = ', fields, ' = = == = = = ', this.processEnd, this.stopnext);

  if (this.selectedTask.form_fields?.type === 'simple' || this.selectedTask.form_fields?.type === 'multi_step') {
    this.manageFieldVisibility(changedField, fields);
  }

  if (this.processEnd || this.stopnext) {
    console.log("this.processEndObj", this.processEndObj)
      // const passed = this.checkCondition(fieldValue, logic, targetField);
      if(this.processEndObj.index == changedField.index){
        // let logic = changedField.logic || {};
        let logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
        const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
        console.log("passed", passed);
        if(!passed){
          this.errorMessage = null;
          changedField.is_message = false;
          changedField.message = "";

          // if (logic.action === "end_process") {
          //   this.processEnd = false;
          // }
          // if (logic.action === "block_submission") {
          //   this.stopnext = false;
          // }
          this.processEnd = false;
          this.stopnext = false;
          this.disbaledBtnLogic = false;
          this.processEndObj = null
        }

     }
    console.log("this.processEndObj", this.processEndObj);
    return;
  }
  const logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  // --- find the field we check the value of ---
  const targetField = fields.find(f => f.name === logic.field_name);
  if (!targetField) return;

  const fieldValue = targetField.elementData?.value;

  console.log("fieldValuefieldValue", fieldValue);
  // const passed = fieldValue || logic.action == "hide_field" || logic.action == "show_field"?this.checkCondition(fieldValue, logic, targetField):false;

  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // logic.action === "show_field";

  console.log("shouldCheck", shouldCheck)
const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;

  console.log("Checking:", targetField.name, "Value:", fieldValue, "Rule:", logic, "Passed:", passed);

  // --- find field to hide/show ---
  let hideShowField: any = null;
  if (logic.hide_show_field && this.selectedTask.form_fields?.type === 'multi_step') {
    const section = this.selectedTask.form_fields?.fields.find(el => el.name === logic.action_page_type);
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
  } else {
    hideShowField = logic.hide_show_field
      ? fields.find(f => f.name === logic.hide_show_field)
      : null;
  }

  console.log("targetField", passed)

  if (passed) {
    switch (logic.action) {
      case "show_message":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "block_submission":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || "Form submission blocked";
        break;

      case "hide_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        // hideShowField.hidden = true;
        // // hideShowField.elementData.value = null;
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = false;
        }
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || "Process ended";
        break;
    }
  } else {
    // --- Reset states if condition fails ---
    switch (logic.action) {
      case "hide_field":

      
       if (hideShowField) {
        hideShowField.hidden = false;
        if (hideShowField.elementData) {
          // hideShowField.elementData.value = null;
        }
      }
        targetField.is_message = false;
        targetField.message = "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_message":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;   // ✅ unlock when condition fails
        break;

      case "block_submission":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;     // ✅ unlock when condition fails
        break;

      default:
        break;
    }
  }

  this.recalculateEndProcess(fields);
}

private recalculateEndProcess(fields: any[]) {
  let disableFound = false;

  for (const field of fields) {
    const logic = field.logic;
    if (!logic) continue;

    // If already in processEnd/stopnext mode, verify if condition still holds
    // if (this.processEnd || this.stopnext) {
    //   console.log("this.processEndObj", this.processEndObj, "field", field)
    //   if (this.processEndObj?.index === field.index) {
    //     const passed = this.checkCondition(field.elementData?.value, logic, field);
    //     console.log("Re-checking condition for end_process:", passed);

    //     if (!passed) {
    //       // Reset because condition no longer holds
    //       this.errorMessage = null;
    //       field.is_message = false;
    //       field.message = "";

    //       this.processEnd = false;
    //       this.stopnext = false;
    //       this.disbaledBtnLogic = false;
    //       this.processEndObj = null;
    //     }
    //   }
    //   continue; // don’t exit loop, keep checking other fields
    // }

    // Normal case: check condition fresh

    let shouldCheck =
    field.elementData?.value !== undefined &&
    field.elementData?.value !== null &&
    field.elementData?.value !== "" ||
    field.id == "checkbox" || logic.action === "show_field"
    
    const passed = shouldCheck?this.checkCondition(field.elementData?.value, logic, field):false;
    console.log("passed", passed, "field", field, "login", passed && (logic.action === "end_process" || logic.action === "block_submission"))
    if (passed && (logic.action === "end_process" || logic.action === "block_submission")) {
      disableFound = true;
      this.processEndObj = { index: field.index, action: logic.action };
      break;
    }
  }

  // Apply final state if not already reset
  if (!this.processEnd && !this.stopnext) {
    this.disbaledBtnLogic = disableFound;
    this.processEnd = disableFound;
    this.stopnext = disableFound;
  }

  console.log("Recalculated end_process:", {
    disableFound,
    processEnd: this.processEnd,
    stopnext: this.stopnext,
    processEndObj: this.processEndObj
  });
}


private checkCondition(fieldValue: any, rule: any, targetField: any): boolean {

  console.log("fieldValue: any, rule: any, targetField", fieldValue, rule, targetField)
  const value = rule.value;
  const fieldType =
    targetField?.elementData?.type ||
    targetField?.logic?.type ||
    targetField?.id;

  console.log("fieldType", fieldType);

  // if (fieldValue == null || fieldValue === '') return false;

  // --- TEXT FIELD (by length) ---
  if (fieldType === 'single-line' || fieldType === 'multi-line') {
    const length = fieldValue?.toString().replace(/\n/g, '').trim()?.length || null;
    if(length == null){
      return false;
    }
    const ruleNum = Number(value);
    switch (rule.is) {
      case 'eq': return length === ruleNum;
      case 'neq': return length !== ruleNum;
      case 'lt': return length < ruleNum;
      case 'gt': return length > ruleNum;
      case 'lte': return length <= ruleNum;
      case 'gte': return length >= ruleNum;
      default: return false;
    }
  }

  // --- NUMBER FIELD ---
  // if (fieldType === 'number') {
  //   const numVal = Number(fieldValue);
  //   if (isNaN(numVal)) return false;

  //   let mainCheck = true;

  //   // first rule check (eq, gt, lt etc.)
  //   if (rule.and_number !== undefined && rule.and_number !== null && rule.and_number !== '') {
  //     const numRule = Number(rule.and_number);
  //     switch (rule.is) {
  //       case 'eq': mainCheck = numVal === numRule; break;
  //       case 'neq': mainCheck = numVal !== numRule; break;
  //       case 'lt': mainCheck = numVal < numRule; break;
  //       case 'gt': mainCheck = numVal > numRule; break;
  //       case 'lte': mainCheck = numVal <= numRule; break;
  //       case 'gte': mainCheck = numVal >= numRule; break;
  //     }
  //   }

  //   // second rule check (and_number, to_number, number_grather)
  //   let secondCheck = true;
  //   if (rule.number_grather && rule.and_number !== '') {
  //     const andNum = Number(rule.and_number);
  //     const toNum = Number(rule.to_number);
  //     switch (rule.number_grather) {
  //       case 'eq': secondCheck = numVal === andNum; break;
  //       case 'neq': secondCheck = numVal !== andNum; break;
  //       case 'lt': secondCheck = numVal < andNum; break;
  //       case 'gt': secondCheck = numVal > andNum; break;
  //       case 'lte': secondCheck = numVal <= andNum; break;
  //       case 'gte': secondCheck = numVal >= andNum; break;
  //       case 'between': secondCheck = numVal >= andNum && numVal <= toNum; break;
  //     }
  //   }

  //   return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
  // }

  if (fieldType === 'number') {
  const numVal = Number(fieldValue);
  if (isNaN(numVal)) return false;

  let mainCheck = true;

  // First operator check (is)
  if (rule.is && rule.and_number !== '') {
    const numRule = Number(rule.and_number);
    switch (rule.is) {
      case 'eq': mainCheck = numVal === numRule; break;
      case 'neq': mainCheck = numVal !== numRule; break;
      case 'lt': mainCheck = numVal < numRule; break;
      case 'gt': mainCheck = numVal > numRule; break;
      case 'lte': mainCheck = numVal <= numRule; break;
      case 'gte': mainCheck = numVal >= numRule; break;
    }
  }

  // Second operator check (number_grather / between)
  let secondCheck = true;
  if (rule.number_grather) {
    const andNum = Number(rule.and_number);
    const toNum = rule.to_number ? Number(rule.to_number) : null;

    switch (rule.number_grather) {
      case 'eq': secondCheck = numVal === toNum; break;
      case 'neq': secondCheck = numVal !== toNum; break;
      case 'lt': secondCheck = numVal < toNum; break;
      case 'gt': secondCheck = numVal > toNum; break;
      case 'lte': secondCheck = numVal <= toNum; break;
      case 'gte': secondCheck = numVal >= toNum; break;
      case 'between':
        if (toNum !== null) {
          secondCheck = numVal >= andNum && numVal <= toNum;
        } else {
          secondCheck = false; // invalid rule definition
        }
        break;
    }
  }
  console.log("rule.number_grather ? (mainCheck && secondCheck) : mainCheck", rule.number_grather , (mainCheck && secondCheck) , mainCheck, secondCheck)

  return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
}


  // --- DATE/TIME FIELD ---
 if (fieldType === 'date') {
    const fieldDateObj = new Date(fieldValue);
    const ruleDateObj = new Date(value);

    if (isNaN(fieldDateObj.getTime()) || isNaN(ruleDateObj.getTime())) return false;

    // Zero out the time part
    fieldDateObj.setHours(0, 0, 0, 0);
    ruleDateObj.setHours(0, 0, 0, 0);

    const fieldDate = fieldDateObj.getTime();
    const ruleDate = ruleDateObj.getTime();

    switch (rule.is) {
      case 'eq': return fieldDate === ruleDate;
      case 'neq': return fieldDate !== ruleDate;
      case 'lt': return fieldDate < ruleDate;
      case 'gt': return fieldDate > ruleDate;
      case 'lte': return fieldDate <= ruleDate;
      case 'gte': return fieldDate >= ruleDate;
      default: return false;
    }
  }

  if (fieldType === 'time') {
  // Convert both fieldValue and rule.value (e.g. "4:05 PM") into minutes since midnight
  const parseTime = (timeStr) => {
    if (!timeStr) return NaN;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return NaN;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // total minutes since midnight
  };

  const fieldTime = parseTime(fieldValue);
  const ruleTime = parseTime(value);

  if (isNaN(fieldTime) || isNaN(ruleTime)) return false;

  switch (rule.is) {
    case 'eq': return fieldTime === ruleTime;
    case 'neq': return fieldTime !== ruleTime;
    case 'lt': return fieldTime < ruleTime;
    case 'gt': return fieldTime > ruleTime;
    case 'lte': return fieldTime <= ruleTime;
    case 'gte': return fieldTime >= ruleTime;
    default: return false;
  }
}


  // --- CHECKBOX / RADIO / MULTISELECT ---
//   if (fieldType === 'checkbox' || fieldType === 'radio' || Array.isArray(fieldValue)) {
//     // Collect selected values properly for checkbox
//     let selectedValues: any[] = [];
//     if (fieldType === 'checkbox' && targetField.elementData?.items) {
//       selectedValues = targetField.elementData.items
//         .filter((item: any) => item.selected)
//         .map((item: any) => item.item);
//     } else {
//       selectedValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
//     }

//     const ruleValues = Array.isArray(value) ? value : [value];
//     switch (rule.is) {
//       case 'includes': return ruleValues.some(v => selectedValues.includes(v));
//       case 'not_includes': return ruleValues.every(v => !selectedValues.includes(v));
//       default: return false;
//     }
//   }

//   if (fieldType === 'likert-scale' || fieldType === "likert") {
//   const likertItems: string[] = targetField?.elementData?.items?.map((i: any) => i.item) || [];

//   if (!likertItems.length) return false;

//   const fieldIndex = likertItems.indexOf(fieldValue) + 1;
//   let ruleIndex = -1;

//   if (Array.isArray(value) && value.length > 0) {
//     ruleIndex = likertItems.indexOf(value[0]) + 1;
//   } else if (typeof value === "string") {
//     ruleIndex = likertItems.indexOf(value) + 1;
//   }

//   if (fieldIndex <= 0 || ruleIndex <= 0) return false;

//   switch (rule.is) {
//     case 'eq': return fieldIndex === ruleIndex;
//     case 'neq': return fieldIndex !== ruleIndex;
//     case 'lt': return fieldIndex < ruleIndex;
//     case 'gt': return fieldIndex > ruleIndex;
//     case 'lte': return fieldIndex <= ruleIndex;
//     case 'gte': return fieldIndex >= ruleIndex;
//     default: return false;
//   }
// }

 if (fieldType === 'likert-scale' || fieldType === 'likert') {
  // Get selected value(s)
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  const likertOrder = targetField.elementData?.items?.map(it => it.item) || [];

  const selectedRank = likertOrder.indexOf(selectedValues[0]);
  const ruleRank = likertOrder.indexOf(ruleValues[0]);

  console.log('Likert selected:', selectedValues[0], 'rule:', ruleValues[0], 'comparison:', rule.is);

  switch (rule.is) {
    case 'eq':
      return selectedValues[0] === ruleValues[0];

    case 'neq':
      return selectedValues[0] !== ruleValues[0];

    case 'includes':
      return ruleValues.includes(selectedValues[0]);

    case 'not_includes':
      return !ruleValues.includes(selectedValues[0]);

    case 'gte':
      return selectedRank >= ruleRank;

    case 'lte':
      return selectedRank <= ruleRank;

    case 'gt':
      return selectedRank > ruleRank;

    case 'lt':
      return selectedRank < ruleRank;

    default:
      return false;
  }
}


  // --- existing checkbox/radio/array logic ---
// RADIO / CHECKBOX / MULTISELECT (replace your current block with this)
// if (fieldType === 'radio' || fieldType === 'checkbox' || Array.isArray(fieldValue)) {
//   // build selectedValues array:
//   let selectedValues: any[] = [];

//   // checkbox: read items[].selected
//   if (fieldType === 'checkbox' && targetField.elementData?.items) {
//     selectedValues = targetField.elementData.items
//       .filter((it: any) => !!it.selected)
//       .map((it: any) => it.item);
//   }
//   // if fieldValue is already an array (multi-select), use it
//   else if (Array.isArray(fieldValue)) {
//     selectedValues = fieldValue.slice();
//   }
//   // radio / single-select: single value -> array
//   else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
//     selectedValues = [fieldValue];
//   } else {
//     selectedValues = [];
//   }


//   const ruleValues = Array.isArray(value) ? value : [value];
//   console.log("selectedValues", selectedValues, ruleValues)
//   switch (rule.is) {
//     // exact match: selectedValues must contain exactly the same items as ruleValues
//     case 'eq':
//       // both arrays equal (order-agnostic)
//     if (selectedValues.length !== ruleValues.length) return false;
//       return ruleValues.every(rv => selectedValues.includes(rv));

//     case 'neq':
//       if (selectedValues.length !== ruleValues.length) return true;
//       return !ruleValues.every(rv => selectedValues.includes(rv));

//     // any match: true if any rule value is present in selectedValues
//     case 'includes':
//       return ruleValues.some(rv => selectedValues.includes(rv));

//     // none of the rule values are present
//     case 'not_includes':
//       return ruleValues.every(rv => !selectedValues.includes(rv));

//     default:
//       return false;
//   }
// }

if (fieldType === 'radio' || Array.isArray(fieldValue)) {
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  console.log("ruleValues", ruleValues, "selectedValues", selectedValues)
  switch (rule.is) {
    case 'eq':
      if (selectedValues.length !== ruleValues.length) return false;
      return ruleValues.every(rv => selectedValues.includes(rv));

    case 'neq':
      if (selectedValues.length !== ruleValues.length) return true;
      return !ruleValues.every(rv => selectedValues.includes(rv));

    case 'includes':
      return selectedValues.length > 0 && ruleValues.some(rv => selectedValues.includes(rv));

    case 'not_includes':
      // treat empty selection as false
      if (!selectedValues.length) return false;
      return !ruleValues.some(rv => selectedValues.includes(rv));

    default:
      return false;
  }
}

// console.log("fieldType",fieldType)

if (fieldType === 'checkbox') {
  const selectedValues: string[] = targetField.elementData?.items
    ?.filter((item: any) => item.selected)
    .map((item: any) => {
      // Adjust here depending on your data structure
      return (item.value || item.item || item.label || '').toString().trim().toLowerCase();
    }) || [];

  const ruleValues: string[] = (Array.isArray(value) ? value : [value])
    .map(v => (v ?? '').toString().trim().toLowerCase());


    console.log('Selected Values:', selectedValues);
    console.log('Rule Values:', ruleValues);

    if(selectedValues.length == 0){
      return false
    }

  switch (rule.is) {
    case 'includes':
      return ruleValues.some(rv => selectedValues.includes(rv));
    case 'not_includes':
      return ruleValues.every(rv => !selectedValues.includes(rv));
    case 'eq':
      return selectedValues.length === ruleValues.length &&
             ruleValues.every(rv => selectedValues.includes(rv));
    case 'neq':
      return !(selectedValues.length === ruleValues.length &&
               ruleValues.every(rv => selectedValues.includes(rv)));
    default:
      return false;
  }
}



if (fieldType === 'dropdown') {
  // actual selected value from dropdown
  const selectedValue = targetField.elementData?.value || '';

  // normalize rule values into array
  const ruleValues = Array.isArray(value) ? value : [value];

  switch (rule.is) {
    case 'eq':
    case 'includes':
      // Match if selected value equals any of the rule values
      return ruleValues.includes(selectedValue);

    case 'neq':
    case 'not_includes':
      // Match if selected value does NOT equal any of the rule values
      return !ruleValues.includes(selectedValue);

    default:
      return false;
  }
}


  // --- DEFAULT STRING/OTHER ---
  switch (rule.is) {
    case 'eq': return fieldValue == value;
    case 'neq': return fieldValue != value;
    default: return false;
  }
}


manageFieldVisibility(changedField: any, fields: any[]) {
  // const logic = changedField.logic || {};
  const logic =  Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  let targetField: any;
  let hideShowField: any = null;

  if (this.selectedTask.form_fields?.type === 'multi_step' && logic.hide_show_field) {
    const section = this.selectedTask.form_fields?.fields.find(el => el.name === logic.action_page_type);
    targetField = fields.find(f => f.name === logic.field_name);
   if(!targetField?.elementData?.value){
      hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
    }
  } else {
    targetField = fields.find(f => f.name === logic.field_name);
    if(!targetField?.elementData?.value){
      hideShowField = logic.hide_show_field ? fields.find(f => f.name === logic.hide_show_field) : null;
    }
  }

  if (!targetField) return;

  //   if (this.processEnd || this.stopnext) {
  //     // const passed = this.checkCondition(fieldValue, logic, targetField);
  //     if(this.processEndObj.index == changedField.index){
  //       let logic = changedField.logic || {};
  //       const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
  //       console.log("passed", passed);
  //       if(!passed){
  //         this.errorMessage = null;
  //         changedField.is_message = false;
  //         changedField.message = "";
  //         this.processEnd = false;
  //         this.stopnext = false;
  //         this.disbaledBtnLogic = false;
  //         this.processEndObj = null
  //       }

  //     }
  //   console.log("this.processEndObj", this.processEndObj);
  //   return;
  // }

  const fieldValue = targetField.elementData?.value;
  let showfiledvlaue;
  
 
  console.log("fieldValue", fieldValue)
  console.log("logic", logic);
  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // ||
  // (logic.action === "hide_field" && (logic.is!='lt' || logic.is!='lte'))
  // (logic.action === "show_field" && (logic.is=='lt' || logic.is=='lte'));

if(logic.action === "hide_field"){
  console.log("shouldCheck", shouldCheck, logic.action)
}
  

const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;
  console.log("passed", passed);
  // --- handle hide/show / end_process / block_submission ---
  if (passed) {
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) hideShowField.hidden = true;
        break;

      case 'hide_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        break;

      case 'show_message':
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || '';
        break;

      case 'block_submission':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || 'Form submission blocked';
        break;

      case 'end_process':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || 'Process ended';
        break;
    }
  } else {
    // --- reset only for actions that are not end_process / block_submission ---
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'hide_field':
        if (hideShowField) hideShowField.hidden = false;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'show_message':
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'block_submission':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'end_process':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;
    }
  }

  console.log('manageFieldVisibility ->', {
    targetField,
    hideShowField,
    passed,
    action: logic.action
  });
}

}

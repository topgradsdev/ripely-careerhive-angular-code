import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
import Quill from 'quill';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import { HttpResponseCode } from 'src/app/shared/enum';
import { Utils } from 'src/app/shared/utility';
import { FileIconService } from 'src/app/shared/file-icon.service';

@Component({
  selector: 'app-view-company-submissions',
  templateUrl: './view-company-submissions.component.html',
  styleUrls: ['./view-company-submissions.component.scss']
})
export class ViewCompanySubmissionsComponent  implements OnInit {
  @Input() employerProfile: any;
  
  @ViewChild('removedepartmentConfirm') removedepartmentConfirm;
  @ViewChild('removedepartmentMessage') removedepartmentMessage;
  @ViewChild('adddepartment') adddepartment;
  @ViewChild('removeContact') removeContact;
  contactList = [];
  addDepartmentForm: FormGroup;
  departmentList:any = [];
  @Input() updatedPlacementDetail: any;
  isWILWritePermission = false;
  search:any ="";
  submissionCreate:boolean =false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService,
    private sanitizer: DomSanitizer,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef, private fileIconService:FileIconService
  ) { }

    getSafeSvg(documentName: string) {
     return this.fileIconService.getFileIcon(documentName);
    }

  ngOnInit(): void {
    console.log("this.updatedPlacementDetail", this.employerProfile);

   
    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
    //   this.placementId = params.get('id');
    // });
    // this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
    //   this.stage = params['params']['stage'] ? params['params']['stage'] : 'Pre-Placement';
    //   this.selectedTabIndex = 0;
    //   if (this.stage === 'Pre-Placement') {
    //     this.selectedTabIndex = 0
    //   } else if (this.stage === 'Ongoing') {
    //     this.selectedTabIndex = 1;
    //   } else if (this.stage === 'Post-Placement') {
    //     this.selectedTabIndex = 2;
    //   }
    // })
    this.addDepartmentForm = new FormGroup({
      department_id: new FormControl('', [Validators.required]),
    })
    this.getStudentOfCompany();
   
  }

  callApi(){
    if(this.selectedIndex==0){
      this.getStudentProfileById(this.documentpage);
    }else{
      this.getSubmittedDocuments(this.formpage);
    }
  }
  studentList:any = [];
  filteredStudentList:any = [];
selectedStudent:any= null;
  getStudentOfCompany() {
    const payload = {
      company_id: this.employerProfile._id
    }
    this.service.getStudentOfCompany(payload).subscribe(response => {
      if(response.status == 200){
        this.studentList = response.data;
        this.filteredStudentList = [...this.studentList];
        if(this.studentList.length>0){
          this.selectedStudent = this.studentList[0];
         if(this.selectedIndex==0){
      this.getStudentProfileById(this.documentpage);
    }else{
      this.getSubmittedDocuments(this.formpage);
    }
        }
      }else{
         this.studentList = []
      }
      console.log("response.record", response,  this.studentList);
    });
  }


  onChangeSearchKeyword(){
const keyword = this.search.toLowerCase();
    this.filteredStudentList = this.studentList.filter(student =>
      (student.student_name).toLowerCase().includes(keyword)
    );
  }

selectedTask:any;
  selectedForm:any;
   async updateSelectFom(form){
    this.selectedForm =await  form;
    console.log("this.selectedForm", this.selectedForm);
    return false;
   
  }


 async showOnly(data){
    if(data.type){
      // let find = this.placementGroupDetails?.placement_type?.find(e=>e.toLowerCase() == data.type.toLowerCase());
      // if(find){
      //   return true;
      // }else{
      //   return false;
      // }
      return false;
    }else{
      return false;
    }
  }

  removeDepartment(){
    this.removedepartmentConfirm.hide();
  }
 
  addDepartmentSubmit(){
      console.log("this.addDepartmentForm",this.addDepartmentForm);
      this.adddepartment.hide();
  }
  submittedForms:any = []
 formpage:any = 1;
  formlimit:any = 5;
  totalforms:any = 0
  totalformList:any = 0
  getSubmittedDocuments(page) {
    this.formpage = page;
    this.formlimit = 5;
    const payload = {
      student_id: this.selectedStudent?.student_id,
      "limit": this.formlimit,
      "offset": this.formpage-1
    }
    this.service.getSubmittedStudentDocuments(payload).subscribe((res: any) => {
      this.submittedForms = res.records || [];
      this.totalformList = res.record_count || 0;
      this.totalforms = Math.ceil(this.totalformList / this.formlimit);
  
      console.log("Pagination Details:", {
        totalRecords: this.totalformList,
        totalPages: this.totalforms,
        currentPage: this.formpage,
      });

    });
  }


  submittedDeclinedForms:any = []
 formdDeclinedpage:any = 1;
  formdDeclinedlimit:any = 5;
  totaldDeclinedforms:any = 0
  totalformdDeclinedList:any = 0
  getSubmitteddDeclinedDocuments(page) {
    this.formdDeclinedpage = page;
    this.formdDeclinedlimit = 5;
    const payload = {
      student_id: this.selectedStudent?.student_id,
      "limit": this.formdDeclinedlimit,
      "offset": this.formdDeclinedpage-1
    }
    this.service.getSubmittedStudentDeclinedDocuments(payload).subscribe((res: any) => {
      this.submittedDeclinedForms = res.records || [];
      this.totalformdDeclinedList = res.record_count || 0;
      this.totaldDeclinedforms = Math.ceil(this.totalformdDeclinedList / this.formdDeclinedlimit);
  
      console.log("Pagination Details:", {
        totalRecords: this.totalformdDeclinedList,
        totalPages: this.totaldDeclinedforms,
        currentPage: this.formdDeclinedpage,
      });

    });
  }



  selectedIndex:any =0;

  onTabChanged(event){
    console.log("event", event);
    this.selectedIndex = event.index;
    if(this.selectedIndex==0){
      this.getStudentProfileById(this.documentpage);
    }else if(this.selectedIndex==1){
      this.getSubmittedDocuments(this.formpage);
    }else{
        this.getSubmitteddDeclinedDocuments(this.formdDeclinedpage);
      
    }
  }

    documents:any = [];
    documentpage:any = 1;
    documentlimit:any = 5;
    totaldocuments:any = 0
    totaldocumentList:any = 0
    getStudentProfileById(page) {
      // console.log("page", page);
      this.documentpage = page;
      this.documentlimit = 5;
      const payload = {
        _id: this.selectedStudent.student_id,
        "documents_limit": this.documentlimit,
        "documents_offset": this.documentpage-1
      }
      this.service.getStudentProfileById(payload).subscribe((res: any) => {
        this.documents = res.record.documents || []; // Handle empty documents array
        this.totaldocumentList = res.documents_count || 0; // Set total document count
        this.totaldocuments = Math.ceil(this.totaldocumentList / this.documentlimit); // Calculate total pages
        console.log("Pagination Info:", {
          totalRecords: this.totaldocumentList,
          totalPages: this.totaldocuments,
          currentPage: this.documentpage,
        });
  
      });
    }
  
  
  media: any = {
    documents:[],
  }

  files = [];
  
 getFilDoc(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Ensure this.media.documents is initialized
  this.media.documents = this.media?.documents ?? [];

  for (const file of filesArray) {
    if (file.size > 5242880) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      // Clear input so user can reselect the same file
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.documents.push(resp);
    });
  }

  // ✅ Clear input after all processing
  input.value = '';
}

  removeFile(index) {
    this.media.documents.splice(index, 1);
  }

   updateCompanySubmission() {
    const payload = {
      _id: this.selectedStudent?.student_id,
      documents:  [...this.media.documents] 
    }
    this.service.updateStudentProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Student Documents uploaded successfully"
      });
      this.getStudentProfileById(this.documentpage);
      this.submissionCreate = false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
   
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
  downloadFile(url: string) {
    window.open(url);
  }


  async viewPDF(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);

      // Open the blob URL in a new tab
      const newTab = window.open(blobURL, '_blank');
      if (!newTab) {
        throw new Error('Failed to open new tab');
      }

      // Revoke the blob URL after a delay to ensure the PDF is loaded
      setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
      }, 1000); // Adjust timeout as needed

    } catch (error) {
      console.error('There was an error viewing the PDF:', error);
      this.downloadFile(url);
    }
  }

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatSort } from '@angular/material/sort';
import { FileIconService } from 'src/app/shared/file-icon.service';

@Component({
  selector: 'app-submited-form-list',
  templateUrl: './submited-form-list.component.html',
  styleUrls: ['./submited-form-list.component.scss']
})
export class SubmitedFormListComponent implements OnInit {

  formData:any ={};
  private routeSub: Subscription;
  formId:any = '';
  constructor(private router: Router, private route: ActivatedRoute, private service: TopgradserviceService, private fileIconService: FileIconService) {

   
    
  }

  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
  }




  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  formList: any = [
    // {
    //   checkbox: '',
    //   form_id: '',
    //   submitter_name : '',
    //   submitted_at : '',
    //   due_date: '',
    //   status: '',
    //   file: '',
    //   action: ''
    // }
  ];

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      // console.log(params) //log the entire params object
      // console.log(params['id']) //log the value of id
      this.formId = params['id'];
      this.getFormById(this.formId);
      this.getAllForms(this.formId);
    });
    // this.formData =await this.router.getCurrentNavigation().extras?.state?.['data'];
    // if(this.formData){
    //   this.formId = this.formData['id'];
    // // }
    // this.getFormById(this.formId);
    // this.getAllForms(this.formId);
    // this.getAllForms();

  }


  getPaginationData(event) {
    this.paginationObj = event;
    this.getAllForms(this.formId);
  }
  
  checkIsFormValid(formFields) {
    if (formFields && formFields.length > 0) {
      return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
        (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
    } else {
      return true;
    }
  }

  getSelectedTask(data){
    this.selectedTask =data;
  }
  selectedTask:any ={};
  getFormById(id) {
    this.service.getFormById({ _id: id }).subscribe((response: any) => {
      this.formData = response.data[0];
    });
  }

  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0,
    changed:false
  }
  @ViewChild('formTbSort') formTbSort = new MatSort();


  searchForms() {
    this.getAllForms(this.formId);
  }

  searchForm:any = '';
  getAllForms(id) {
    if(id){
      const payload = {
        skip: this.paginationObj.pageIndex * this.paginationObj.pageSize,
        limit: this.paginationObj.pageSize,
        "_id":id
      }
      if(this.searchForm){
        payload['search'] = this.searchForm;
      }
      this.service.getsubmissionList(payload).subscribe((response: any) => {
        this.paginationObj.length = response.count;
        this.formList = response.data;
        // this.formCreators = response.create_by;
        // this.formList.forEach(form => {
        //   form.checked = false;
        //   form.submiters = this.submitters.find(sub => sub.letter === form.submiters)?.name;
        // });
        this.formList = new MatTableDataSource(this.formList);
        this.formList.sort = this.formTbSort;
      });
    }else{
        // this.ngOnInit();
    }   
  }


// 'due_date',
  displayedColumns: string[] = [
    'checkbox',
    'form_id',
    'submitter_name',
    'submitted_at',
    'status',
    'file',
    'actions'
  ];
  dataSource = this.formList;
  @ViewChild(MatTable) table: MatTable<any>;
  activeFilter = {name: 'STATUS', value: ''};
  filters = [
    
    // { name: "FILE_DUE_DATE", label: "Due Date", selected: false, value: ""},
    { name: "STATUS", label: "Status", selected: false, value: ""},
    { name: "ASSIGNED_TO", label: "Assigned to", selected: false, value: ""},
    { name: "SUBMITED_DATE", label: "Submit Date", selected: false, value: ""},
    
  ];
  applyFilter(filter) {
    this.activeFilter = filter;
  }


  checkDropDownFieldPermission(permissions) {
    if (this.selectedTask?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return false;
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return true;
      } else {
        return true;
      }
    }
  }
}

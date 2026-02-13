import { Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-builder-list',
  templateUrl: './form-builder-list.component.html',
  styleUrls: ['./form-builder-list.component.scss']
})
export class FormBuilderListComponent implements OnInit {

  formList: any = [];
  selectedForms: any = [];
  selectedAllForms = false;
  displayedColumns: string[] = [
    'checkbox',
    'title',
    'type',
    'updatedAt',
    'status',
    'submiters',
    'sent',
    'actions'
  ];
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  searchForm = "";
  submitters = [
    { name: 'Students', letter: 's' },
    { name: 'Employers', letter: 'e' },
    { name: 'Students & Employers', letter: 'se' }
  ];

  activeFilter = {name: 'SUBMITERS', value: ''};

  filters = [
    { name: "SUBMITERS", label: "Submitter Type", selected: false, value: ""},
    { name: "STATUS", label: "Status", selected: false, value: ""},
    // { name: "CREATE_BY", label: "Form Creator", selected: false, value: ""},
    { name: "SUBMITED_DATE", label: "Submit Date", selected: false, start_date: "", end_date: ""},
  ];
  formCreators = [];

  @ViewChild('formTbSort') formTbSort = new MatSort();
  selectedSubmitter = null;

  constructor(private service: TopgradserviceService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllForms();
  }

  cleardata(){
this.paginationObj.pageIndex=0;
    this.formList = new MatTableDataSource<any>([]);
    this.formList.data = []; 
    this.formDatas = []; 
  }
  formDatas:any = [];
  getAllForms() {
    const payload = {
      skip: this.paginationObj.pageIndex * this.paginationObj.pageSize,
      limit: this.paginationObj.pageSize
    }
    this.service.getAllForms(payload).subscribe((response: any) => {
      this.paginationObj.length = response.count;
    let data = [...response.data];
      this.formCreators = response.create_by;
      data.forEach(form => {
        form.checked = false;
        form.submiters = this.submitters.find(sub => sub.letter === form.submiters)?.name;
      });
      this.formDatas = [...this.formDatas, ...response.data];
      this.formList = new MatTableDataSource(this.formDatas);
      this.formList.sort = this.formTbSort;
      this.selectedForms = [];
    });
  }

  async searchForms() {
    if(!this.searchForm){
      this.cleardata();
      this.getAllForms();
      return;
    }
    this.paginationObj = {
      length: 0,
      pageIndex: 0,
      pageSize: this.paginationObj.pageSize,
      previousPageIndex: 0,
      changed: true,
  };
    const payload = {
      skip: this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize,
      keywords: this.searchForm
    }
    await this.service.searchForms(payload).subscribe(async(response: any) => {

      console.log("response", response);
      this.paginationObj.length =await response.count? response.count:response.result?.length;
      // this.formList =await response.result;

      const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.formDatas.some(s => s._id === student._id)
        );
       this.formDatas =await [...this.formDatas, ...filteredData];
      await this.formDatas.map(form => {
        form.checked = false;
        form.submiters = this.submitters.find(sub => sub.letter === form.submiters)?.name;
      });
      this.formList =await new MatTableDataSource(this.formDatas);
      this.formList.sort =await this.formTbSort;
      this.selectedForms = [];
    });
  }

  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }

  onCheckboxChange(event: MatCheckboxChange, filter): void {
      console.log('Checkbox changed:', event.checked);
      console.log('this.filters:', this.filters, 'this.filterParameters:', this.filterList, 'filter:', filter, this.activeFilter);
    
      if (event.checked) {
        console.log('Checkbox is selected');
        // Add logic for when the checkbox is selected, if needed.
      } else {
        console.log('Checkbox is deselected');
        
        this.filters.forEach((el:any) => {
          if (filter.name === el.name) {
            filter.value = [];
            // this.activeFilter[filter.name].value = []
            el.value = []; // Corrected 'field' to 'filter.field'
          }
          if (filter.name === 'SUBMITED_DATE') {
            filter.start_date = null;
            filter.end_date = null;
          }
        });
      }
    }


  callApi(){
    console.log("this.filters", this.filters);
    // this.filters.forEach(el=>{
    //   if(el.selected){
    //     el.selected =false
    //   }
    //   if (el.name) {
    //     if(el.name === 'SUBMITED_DATE'){
    //       this.filterParameters.course_start_sdate = null
    //       this.filterParameters.course_start_edate = null
    //     }else if(el.field === 'course_end_date'){
    //       this.filterParameters.course_end_sdate = null
    //       this.filterParameters.course_end_edate = null
    //     }else if(el.field === 'internship_start_date'){
    //       this.filterParameters.internship_start_sdate = null
    //       this.filterParameters.internship_start_edate = null
    //     }else if(el.field === 'internship_end_date'){
    //       this.filterParameters.internship_end_sdate = null
    //       this.filterParameters.internship_end_edate = null
    //     }else{
    //       this.filterParameters[el.field] = []; // Corrected 'field' to 'filter.field'
    //     }
    //   }
    // })

    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      el.value = "";
      
    })
    this.cleardata();
   this.getAllForms();
  }
  @ViewChild('closeFilterModal') closeFilterModal;
  filterCount:any =0;
  filterApply:boolean = false;
  filterList:any = [];
  async filterForms() {
    let previousFilterList = [...this.filterList];
    
    const selectedFilterValue = [];
    let payload =await {
      skip: this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize
    };
    this.filterList = [];
    let isValid = true;
    console.log("this.filters", this.filters);
    await this.filters.forEach(async(filter) => {
      if (filter.selected) {
        this.filterList.push(filter.label);
        if (filter.name === 'SUBMITED_DATE') {
          Object.assign(payload, {submited_start_date: filter.start_date, submited_end_date: filter.end_date});
        } else {
          Object.assign(payload, {[filter.name.toLocaleLowerCase()]: this.activeFilter && this.activeFilter[filter.name]?this.activeFilter[filter.name].value:[filter.value]})
        }
      }else  {
        // If filter value exists but checkbox is not selected, show a message
        if(this.activeFilter.value.length>0){
          let find = await this.filters.find(el=>el.name==this.activeFilter.name)
          // If the filter value exists but checkbox is not selected, show a message
  
          if(find && !find.selected){
            this.service.showMessage({
              message: "Please select the checkbox for filter parameters.",
            });
           isValid = false;  // Exit early on error
          }
        }
      }
    });

    if (!isValid) {
      return;  // Stop further execution and do not call API
    }
    if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
      this.paginationObj = {
          length: 0,
          pageIndex: this.paginationObj.pageIndex,
          pageSize: this.paginationObj.pageSize,
          previousPageIndex: 0,
          changed: false,
      };
  } else {
      console.log("Filter list unchanged, skipping pagination reset.");
  }
  

    this.closeFilterModal.ripple.trigger.click();

    this.service.filterForms(payload).subscribe((response: any) => {
      // this.paginationObj.length = response.result?.length;
      this.filterCount =response.count?response.count: response.result?.length;
       this.paginationObj.length = response.count;
      // if(this.filterList.length>0){
        this.filterApply = true;
      // }
      // this.formList = response.result;
      this.formDatas = [...this.formDatas, ...response.result];
      this.formDatas.forEach(form => {
        form.checked = false;
        form.submiters = this.submitters.find(sub => sub.letter === form.submiters)?.name;
      });
      this.formList = new MatTableDataSource(this.formDatas);
      this.formList.sort = this.formTbSort;
    });
  }

  selectAllForms() {
    if (this.selectedAllForms) {
      this.formList?._renderData?._value.forEach(form => {
        form.checked = true;
      });
    } else {
      this.formList?._renderData?._value.forEach(form => {
        form.checked = false;
      });
    }
    this.selectedForms = this.formList?._renderData?._value.filter(template => template.checked);
  }

  getSelectedForm(form: any) {
      if (form.checked) {
        console.log(this.selectedForms, "this.selectedForms")
        this.selectedForms.push(form);
      } else {
        const idx = this.selectedForms.findIndex(
          selForm => selForm._id === form._id
        );
        if (idx > -1) {
          this.selectedForms.splice(idx, 1);
        }
      }
    }

  getFormsIds(forms) {
    return forms.map(form => form._id);
  }

  editForm(form) {
    if (form.type === 'simple') {
      this.router.navigate(['/admin/form-builder/single-page-form'], {queryParams: {id: form._id}});
    } else if (form.type === 'multi_step') {
      this.router.navigate(['/admin/form-builder/multi-step-form'], {queryParams: {id: form._id}});
    }
  }

  duplicateForm(form) {
    const payload = { _id: form._id };
    this.service.duplicateForm(payload).subscribe((res: any) => {
      this.service.showMessage({
        message:"Duplicate form created successfully"
      });   
      this.cleardata();  
      this.getAllForms();   
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    }); 
  }

  deleteMultipleForms() {
    this.deleteForm(this.selectedForms);
  }

  deleteForm(forms) {
    const payload = { _ids: this.getFormsIds(forms) };
    this.service.deleteForm(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Form deleted successfully"
      });
      this.cleardata();
      this.getAllForms();
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  archiveForm(form) {
    this.selectedForms = [form];
    this.updateForm('archive');
  }

  pauseForm(form) {
    this.selectedForms = [form];
    this.updateForm('pause');
  }

  activateForm(form) {
    this.selectedForms = [form];
    this.updateForm('active');
  }

  downloadForm(form) {
    // console.log(form);
  }

  getFormIds() {
    return this.selectedForms.map(template => template._id);
  }

  updateForm(status) {
    if (this.selectedForms.length === 0) {
      return;
    }
    const payload = {
      _ids: this.getFormIds(),
      status: status
    };
    this.service.updateFormStatus(payload).subscribe((res: any) => {
      this.cleardata();
      this.getAllForms();
      this.service.showMessage({
        message:"form status updated successfully"
      });        
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }


 onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.formList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.formList?.data.length >= this.paginationObj.length) return;
      // alert("calling")
      // Simulate pagination event object
      const nextPageEvent = {
        pageIndex: this.paginationObj?.pageIndex + 1 || 0,
        pageSize: this.paginationObj?.pageSize || 20,
        length: this.paginationObj?.length || 0
      };

      // Call your existing pagination logic
      this.getPaginationData(nextPageEvent);
    // }


    // this.loading = false;
  }


  getPaginationData(event) {
    this.paginationObj = event;

    if(this.searchForm){
      this.searchForms();
    }else {
      if(this.filterList && this.filterList.length>0){
        this.filterForms();
      }else{
        this.getAllForms();
      }
    }
    this.selectedForms = [];
    
  }


  applyFilter(filter) {
    this.activeFilter = filter;
  }

  selectForm(type) {
    if (type === 'single') {
      this.router.navigate(['/admin/form-builder/single-page-form'], {queryParams: {submitter: this.selectedSubmitter}});
    } else {
      this.router.navigate(['/admin/form-builder/multi-step-form'], {queryParams: {submitter: this.selectedSubmitter}});
    }
  }

  gotoDetail(data){
    this.router.navigate(['/admin/form-builder/submited-form-list/'+data._id], {
      state: {
        data:data
      },
    });
  }
}

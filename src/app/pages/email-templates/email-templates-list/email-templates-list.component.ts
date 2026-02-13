import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-email-templates-list',
  templateUrl: './email-templates-list.component.html',
  styleUrls: ['./email-templates-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailTemplatesListComponent implements OnInit {
  change_categories: boolean = true
  displayedColumns: string[] = [
    // 'checkbox',
    'template_name',
    'type',
    'category_title',
    'create_by_name',
    'updatedAt',
    'sent',
    'actions'
  ];

  templateList: any = [];
  templateView = 'list';
  selectedTemplates = [];
  selectAllTemplates = false;
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  searchTemplate = '';

  activeFilter = { name: 'TYPE', value: '' };

  filters = [
    { name: "TYPE", label: "Email Type", selected: false, value: "" },
    { name: "CATEGORY", label: "Category", selected: false, value: "" },
    { name: "CREATE_BY", label: "Updated By", selected: false, value: "" }
  ];
  emailTemplateCreators = [];
  emailTemplateCategories = [];
  categories = [];
  @ViewChild('emailTbSort') empTbSort = new MatSort();

  constructor(private service: TopgradserviceService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllEmailTemplates();
    this.getEmailTemplateCategories();
  }

  getEmailTemplateCategories() {
    this.service.getEmailTemplateCategories().subscribe((response: any) => {
      this.categories = response.data;
    });
  }

  selectTemplate(template) {
    this.selectedTemplates = template;
  }

  changeCategory() {
    this.service.createHtmlTemplate(this.selectedTemplates).subscribe((res: any) => {
      this.change_categories = !this.change_categories
      this.cleardata();
      this.getAllEmailTemplates();
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }
  callApi(){
    console.log(" this.filters",  this.filters);
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if (el.name) {
          el.value = "";
      }
    })
    this.cleardata();
    this.getAllEmailTemplates();
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


   filterApply:boolean = false;
   filterList:any = [];
   @ViewChild('closeFilterModal') closeFilterModal;
  async filterTemplates() {
    let previousFilterList = [...this.filterList];
    let isValid = true;
    const selectedFilterValue = [];
    this.filterList = [];
    console.log("this.filters", this.filters);
    await this.filters.forEach(async(filter) => {
      if (filter.selected) {
        this.filterList.push(filter.label);
        selectedFilterValue.push({ name: filter.name.toLocaleLowerCase(), value: filter.value });
      }else {
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

    console.log("this.filters", this.filters, "selectedFilterValue", selectedFilterValue)

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

    // return false;
    const payload = {
      keyword: this.searchTemplate,
      filter: selectedFilterValue,
      skip: this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize
    }
    this.service.filterEmailTemplates(payload).subscribe((response: any) => {
      this.paginationObj.length = response.count;
      if(this.filters.length>0){
        this.filterApply = true;
      }
      this.templateData = [...this.templateData, ...response.data];
      this.templateData.forEach(template => {
        template.checked = false;
      });
      this.templateList = new MatTableDataSource(this.templateData);
      this.templateList.sort = this.empTbSort;
    });
  }

  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }


  searchTemplates() {
    if(!this.searchTemplate){
       this.cleardata();
      this.getAllEmailTemplates();
      return;
    }
    this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
    const selectedFilterValue = [];
    this.filters.forEach(filter => {
      if (filter.selected) {
        selectedFilterValue.push({ name: filter.name.toLocaleLowerCase(), value: filter.value });
      }
    });

    console.log("this.filters", this.filters, "selectedFilterValue", selectedFilterValue)

    // return false;
    const payload = {
      skip: this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize,
      keywords: this.searchTemplate,
    }
    this.service.searchEmailTemplates(payload).subscribe((response: any) => {
      this.paginationObj.length =   response.count? response.count:response.result?.length;
      // this.templateList = response.result;
      const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.templateData.some(s => s._id === student._id)
        );
      this.templateData = [...this.templateData, ...filteredData];
      this.templateData.forEach(template => {
        template.checked = false;
      });
      this.templateList = new MatTableDataSource(this.templateData);
      this.templateList.sort = this.empTbSort;
      this.selectAllTemplates = false;
      this.selectAllEmailTemplates();
    });
  }

  cleardata(){
this.paginationObj.pageIndex=0;
    this.templateList = new MatTableDataSource<any>([]);
    this.templateList.data = []; 
    this.templateData = [];
  }
  templateData:any = [];
  getAllEmailTemplates() {
    const payload = {
      skip: this.paginationObj.pageIndex,
      limit: this.paginationObj.pageSize
    }
    this.service.getAllEmailTemplate(payload).subscribe((response: any) => {
      this.paginationObj.length = response.count;
      // this.templateList = response.data;
      this.templateData = [...this.templateData, ...response.data];
      this.emailTemplateCreators = response.create_by;
      this.emailTemplateCategories = response.category;
      this.templateData.forEach(template => {
        template.checked = false;
      });
      this.templateList = new MatTableDataSource(this.templateData);
      this.templateList.sort = this.empTbSort;
      this.selectAllTemplates = false;
      this.selectAllEmailTemplates();
    });
  }

  selectAllEmailTemplates() {
    if (this.selectAllTemplates) {
      this.templateList?._renderData?._value.forEach(template => {
        template.checked = true;
      });
    } else {
      this.templateList?._renderData?._value.forEach(template => {
        template.checked = false;
      });
    }
    this.selectedTemplates = this.templateList?._renderData?._value.filter(template => template.checked);
  }

  getSelectedTemplate(template) {
    if (template.checked) {
      this.selectedTemplates.push(template);
    } else {
      const idx = this.selectedTemplates.findIndex(selTemplate => selTemplate._id === template._id);
      this.selectedTemplates.splice(idx, 1);
    }
  }

  getTemplatesIds(templates) {
    return templates.map(template => template._id);
  }

  editEmailTemplate(template) {
    console.log(template);
    if (template.type === 'plain') {
      this.router.navigate(['/admin/email-templates/plain-text-email'], { queryParams: { id: template._id } });
    } else if (template.type === 'html') {
      this.router.navigate(['/admin/email-templates/html-email/'], { queryParams: { id: template._id } });
    }
  }

  duplicateEmailTemplate(template) {
    const payload = { _id: template._id };
    this.service.duplicateTemplates(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Duplicate email template created successfully"
      });
       this.cleardata();
      this.getAllEmailTemplates();
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  deleteMultipleTemplates() {
    this.deleteEmailTemplate(this.selectedTemplates);
  }

  deleteEmailTemplate(templates) {
    const payload = { _ids: this.getTemplatesIds(templates) };
    this.service.deleteTemplates(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Email Template deleted successfully"
      });
       this.cleardata();
      this.getAllEmailTemplates();
    }, err => {
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  resetfilter(){
    // this.filterList = [];
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
      };
   }



 onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.templateList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.templateList?.data.length >= this.paginationObj.length) return;
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
    console.log("event", event, this.searchTemplate)
    if(this.searchTemplate){
      this.searchTemplates();
    }else {
      if(this.filterList && this.filterList.length>0){
        this.filterTemplates();
      }else{
        this.getAllEmailTemplates();
      }
    }
    this.selectAllTemplates = false;
    this.selectAllEmailTemplates();
  }

  applyFilter(filter) {
    this.activeFilter = filter;
  }

}

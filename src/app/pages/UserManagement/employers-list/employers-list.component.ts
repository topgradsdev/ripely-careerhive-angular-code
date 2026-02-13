import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
declare var $;
export interface UserData {
  id: string;
  name: string;
  lname: string;
  email: string;
  company: string;
  jobtitle: string;
  creation: string;
}

/** Constants used to fill up our data base. */
const LNAME: string[] = [
  'A', 'T', 'V', 'C', 'J', 'R', 'J', 'J'
];
const NAMES: string[] = [
  'Maia', 'Asher',
];
const EMAILS: string[] = [
  'maia@gmail.com', 'asher@gmail.com', 'olivia@gmail.com', 'atticus@gmail.com', 'amelia@gmail.com', 'jack@gmail.com', 'charlotte@gmail.com', 'theodore@gmail.com', 'isla@gmail.com', 'oliver@gmail.com',
  'isabella@gmail.com', 'jasper@gmail.com', 'cora@gmail.com', 'levi@gmail.com', 'violet@gmail.com', 'arthur@gmail.com', 'mia@gmail.com', 'thomas@gmail.com', 'elizabeth@gmail.com'
];
const COMPANY: string[] = [
  'Promatics', 'PromaticsA', 'PromaticsB', 'PromaticsC', 'PromaticsD', 'PromaticsE', 'PromaticsF', 'PromaticsG', 'Promatics', 'Promatics',
  'Promatics', 'Promatics', 'Promatics', 'Promatics', 'Promatics', 'Promatics', 'Promatics', 'Promatics', 'Promatics'
];
const TITLE: string[] = [
  'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Promatics',
  'Promatics', 'Promatics', 'Employer', 'Employer', 'Employer', 'Employer', 'Employer', 'Promatics', 'Promatics'
];
const CREATION: string[] = [
  '12-01-2012 (06:22 PM)', '12-12-2012 (02:22 PM)', '12-12-2012 (03:12 PM)', '24-11-2012 (03:12 PM)', '12-01-2012 (06:22 PM)', '12-01-2012 (02:22 PM)', '12-01-2012 (03:12 PM)', '12-01-2012 (03:12 PM)', '12-01-2012 (03:12 PM)',
  '09-01-2021 (06:22 PM)', '09-01-2021 (06:22 PM)', '12-01-2012 (02:22 PM)', '12-04-2012 (03:12 PM)', '12-01-2012 (06:22 PM)', '12-01-2012 (02:22 PM)', '12-01-2012 (02:22 PM)', '09-01-2021 (03:12 PM)'
];


@Component({
  selector: 'app-employers-list',
  templateUrl: './employers-list.component.html',
  styleUrls: ['./employers-list.component.scss']
})
export class EmployersListComponent implements AfterViewInit {


  emplist = []
  displayedColumns: string[] = ['select', 'id', 'name', 'lname', 'email', 'company', 'jobtitle', 'status', 'creation', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);


  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalRecords: any;
  delId: any;
  event: any;
  topPage: any;
  sortedData: any;
  search: any;
  empForm: FormGroup
  selectedUser: any = [];
  company_name: any;
  activeCount: any;
  createdCount: any;
  deletedCount: any;
  selectedValue: any

  csvData: any;
  jsonFpmMngt: any = []
  filterVal: any;
  companyData: any = []
  deactiveCount: any;

  registerEmpForm: FormGroup;
  emailExists: boolean = false;
  selectedLevel: string;
  industryList = [];

  constructor(private route: ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar,
    private fb: FormBuilder,) {

    this.empForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],

    })


    const users = Array.from({ length: 50 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);
    this.intializeEmployerForm();
    this.getIndustryList();
  }

  checkPasswordAndMail(group: FormGroup) {
    // let pass = group.controls.password.value;
    // let confirm_password = group.controls.confirm_password.value;
    let email = group.controls.email.value;
    let confirm_email = group.controls.confirm_email.value;
    var  flag = false
    let returnable:any = {
      pwdNotSame:null,
      mailNotSame:null
    }
    // if(pass != confirm_password){
    //   returnable.pwdNotSame = true
    //   flag=true
    // }
    if(email != confirm_email){
      returnable.mailNotSame = true
      flag=true
    }
    return flag ? returnable : null;
  }

  getIndustryList() {
    let param = 'search=';
    this.Service.getIndustry(param).subscribe(res => {
      this.industryList = res.data;
    })
  }

  intializeEmployerForm() {
    this.registerEmpForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      confirm_email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      company: ['', Validators.required],
      industry: ['', Validators.required],
      others: [''],
      // password: ['', [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/)]],
      // confirm_password: ['', Validators.required],
      // terms: ['', Validators.requiredTrue]
    }, {
      validator: this.checkPasswordAndMail,
    });
  }

  ngAfterViewInit() {


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.company_name = ''
    this.search = ''
    this.employerlist();
  }
  select(event) {
    this.selectedValue = event.target.value
    this.employerlist()

  }

  selectfilters(event) {
    this.companyData = []
    console.log("filtersVal", event.target.value);
    this.filterVal = event.target.value
    var obj: any = {
      limit: 5,
      offset: 0,
      role: "Employer",
      search: this.search,
      filter: this.selectedValue,
      company_name: this.company_name,
    }
    this.Service.emplist(obj).subscribe(res => {
      res.data.map((val) => {
        this.companyData.push(val.company_name)
      })
    })
  }
  selectsubfilters(event) {
    console.log("filtersubsVal", event.target.value);
    this.company_name = event.target.value
  }
  applyFilters() {
    this.employerlist()
  }


  modal(id) {
    this.smallModal.show()
    this.delId = id
  }

  deleteEmp(id) {
    var obj = {
      deletedAt: true,
      user_id: id,
      role: "employer"
    }
    this.Service.deleteuser(obj).subscribe(res => {
      this.smallModal.hide()
      if (res.code == 200) {
        this._snackBar.open("User Deleted Successfully", "close", {
          duration: 2000
        });
        this.ngOnInit()
      }
    }, err => {
      this._snackBar.open("Some Error Occued", "close", {
        duration: 2000
      })
    })
  }

  employerlist() {
    var obj: any = {
      limit: 5,
      offset: 0,
      role: "Employer",
      search: this.search,
      company_name: this.company_name,
      filter: this.selectedValue,
    }
    this.Service.emplist(obj).subscribe(data => {
      console.log(data, "employersssss");

      this.activeCount = data?.activeCount;
      this.deactiveCount = data?.deactiveCount;
      this.createdCount = data?.count
      this.deletedCount = data?.deletedCount
      this.emplist = data.data
      this.totalRecords = data.count;

      // for download csv
      this.jsonFpmMngt = []
      this.emplist.forEach((res: any) => {
        this.jsonFpmMngt.push({
          first_name: res?.first_name,
          last_name: res?.last_name,
          email: res?.email,
          company_name: res?.company_name,
          role: res?.role,
          createdAt: moment(res?.createdAt).format('yyyy-MM-dd')
        })
      })

    }, err => {
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        // this.toastr.error('Some error occured, please try again!!', 'Error')
        console.log('Internet Connection Error')
      }
    })
  }


  applyFilter(filterValue) {

    this.search = filterValue.target.value
    if (this.event) {
      this.paginationOptionChange(this.event)
    }
    else {
      this.employerlist()

    }

  }

  paginationOptionChange(evt) {
    this.event = evt
    this.topPage = evt.pageIndex
    var obj: any = {
      role: "Employer",
      search: this.search,
      limit: evt.pageSize,
      offset: (evt.pageIndex * evt.pageSize),
      company_name: this.company_name
    }
    this.Service.emplist(obj).subscribe(async data => {
      this.emplist = data.data,
        this.sortedData = this.emplist
      this.totalRecords = data.count
    })
  }
  getPageSizeOptions() {
    return [5, 10, 50, 100];
  }


  cross() {
    this.empForm.reset()
  }
  bulk() {
    this.empForm.reset()
  }


  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.emplist.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item.email) == -1) {
          this.selectedUser?.push(item.email);
        }
      });
    } else {
      this.emplist.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.emplist?.length) {
      return true;
    }

    return false;
  }

  selectUser(event, email): void {
    if (event?.checked) {
      this.selectedUser?.push(email);
    } else {
      var index = this.selectedUser?.indexOf(email);
      this.selectedUser?.splice(index, 1);
    }
  }


  sendMail() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched()
      this._snackBar.open('Please fill all the required fields ', 'close', {
        duration: 2000
      })
    }
    else if (this.selectedUser == '') {
      this._snackBar.open('Please select at least one email ', 'close', {
        duration: 2000
      })
    } else {
      var obj = {
        email: this.selectedUser,
        subject: this.empForm.value.title,
        description: this.empForm.value.description,
      }
      this.Service.sendEmailUserManagement(obj).subscribe(res => {
        this._snackBar.open('Email sent successfully ', 'close', {
          duration: 2000
        })
        $('#closeModal').click();
        this.ngOnInit()
        this.selectedUser = []

      })
    }

  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  // CSV Format Download
  csvDownload() {
    console.log("aassdd", this.jsonFpmMngt);

    this.downloadFile(this.jsonFpmMngt, "EmployerRecord", "employerList");

  }
  // ---------- Download Function ------
  downloadFile(data: any, filename = "data", type = "string") {
    if (type == "employerList") {
      this.csvData = this.ConvertToCSV(data, [
        "first_name",
        "last_name",
        "email",
        "company_name",
        "role",
        "createdAt"
      ]);
    }
    let blob = new Blob(["\ufeff" + this.csvData], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  // ----------------------------Converting Json To Csv File -------------------

  ConvertToCSV(objArray: any, headerList: any) {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "S.No,";
    for (let index in headerList) {
      row += headerList[index] + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + "";
      for (let index in headerList) {
        let head = headerList[index];

        line += "," + array[i][head];
      }
      str += line + "\r\n";
    }
    return str;
  }

  selected(){
    console.log(this.selectedLevel)
    if(this.selectedLevel == 'custom_roles'){
        this.registerEmpForm.get('others')!.setValidators([Validators.required]); // 5.Set Required Validator
        this.registerEmpForm.get('others')!.updateValueAndValidity();
    }else {
        this.registerEmpForm.get('others')!.clearValidators(); // 6. Clear All Validators
        this.registerEmpForm.get('others')!.updateValueAndValidity()
    }
  }

  createAccount(){
    if(this.registerEmpForm.invalid || this.emailExists){
      this.registerEmpForm.markAllAsTouched();
      return;
    }

    let obj:any= {
      first_name: this.registerEmpForm.controls.first_name.value,
      last_name: this.registerEmpForm.controls.last_name.value,
      email: this.registerEmpForm.controls.email.value,
      company_name:this.registerEmpForm.controls.company.value,
    }
    if(this.selectedLevel=='custom_roles'){
        obj.custom_industry = this.registerEmpForm.controls.others.value
    } else {
        obj.industry_id = this.registerEmpForm.controls.industry.value
    }
    
    this.Service.createEmployer(obj).subscribe((res: any) => {
      $('#closeEmployerCreationModal').click();
      this.employerlist();
      this.Service.showMessage({
        message:"Employer account created Successfully"
      });        
    }, err => {        
      this.Service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  checkEmailExists(e: any){
    this.Service.checkEmailExists(e.target.value).subscribe((res: any) => {
      this.emailExists = res
    })
  }

}

function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ';
  const email = EMAILS[Math.round(Math.random() * (EMAILS.length - 1))] + ' ';
  const company = COMPANY[Math.round(Math.random() * (COMPANY.length - 1))] + ' ';
  const jobtitle = TITLE[Math.round(Math.random() * (TITLE.length - 1))] + ' ';
  const creation = CREATION[Math.round(Math.random() * (CREATION.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    name: name,
    email: email,
    company: company,
    jobtitle: jobtitle,
    creation: creation,
    lname: LNAME[Math.round(Math.random() * (LNAME.length - 1))],

  };
}
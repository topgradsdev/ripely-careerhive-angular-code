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
  location: string;
  wrkpref: string;
  availability: string;
  education: string;
  license: string;
  wrkrights: string;
  skills: string;
}

/** Constants used to fill up our data base. */
const LNAME: string[] = [
  'A', 'T', 'V', 'C', 'J', 'R', 'J', 'J'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
const EMAILS: string[] = [
  'maia@gmail.com', 'asher@gmail.com', 'olivia@gmail.com', 'atticus@gmail.com', 'amelia@gmail.com', 'jack@gmail.com', 'charlotte@gmail.com', 'theodore@gmail.com', 'isla@gmail.com', 'oliver@gmail.com',
  'isabella@gmail.com', 'jasper@gmail.com', 'cora@gmail.com', 'levi@gmail.com', 'violet@gmail.com', 'arthur@gmail.com', 'mia@gmail.com', 'thomas@gmail.com', 'elizabeth@gmail.com'
];
const CREATION: string[] = [
  '12-01-2012 (06:22 PM)', '12-12-2012 (02:22 PM)', '12-12-2012 (03:12 PM)', '24-11-2012 (03:12 PM)', '12-01-2012 (09:23 AM)', '12-01-2012 (09:23 AM)', '12-01-2012 (10:23 AM)', '12-01-2012 (07:14 PM)', '12-01-2012 (03:30 PM)',
  '09-01-2021 (09:12 AM)', '09-01-2021 (06:22 PM)', '12-01-2012 (02:22 PM)', '12-04-2012 (03:12 PM)', '12-01-2012 (09:12 AM)', '12-01-2012 (06:22 PM)', '12-01-2012 (06:22 PM)', '09-01-2021 (06:22 PM)'
];
const LOCATION: string[] = [
  'Sydney', 'Melbourne'
];
const WRKPREF: string[] = [
  'Open', 'Any'
];
const AVAILABILITY: string[] = [
  'Any', 'Remote'
];
const EDUCATION: string[] = [
  'Macquarie University', 'The University of New England', 'The University of Sydney', 'Western Sydney University'
];
const LICENSE: string[] = [
  'Available', 'Not Available'
];
const WRKRIGHTS: string[] = [
  'Available', 'Not Available'
];
const SKILLS: string[] = [
  'Figma', 'Adobe Illustrator'
];



@Component({
  selector: 'app-graduate-list',
  templateUrl: './graduate-list.component.html',
  styleUrls: ['./graduate-list.component.scss']
})
export class GraduateListComponent implements AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'name', 'lname', 'email', 'company', 'location', 'wrkpref', 'profile_percentage', 'availability', 'wrkrights', 'status', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: any;
  event: any;
  selectFilter: any = [];
  delId: any;
  gradlist: any;
  search: any;
  totalRecords: any;
  sortedData: any;
  graduateList: any;
  topPage: any;
  work_preference: any;
  location: any;
  work_right: any;
  availability: any;
  filterValue: any;
  main_filter: any = ""
  sub_filter: any = ""
  flag: boolean = false;
  gradForm: FormGroup
  selectedUser: any = [];
  limitOffset: any = {
    limit: 5,
    offset: 0
  };
  activeCount: any;
  createdCount: any;
  deletedCount: any;
  selectedValue: any

  csvData: any;
  jsonFpmMngt: any = []
  gradlistLocation: any;
  filtersData: any;
  subFilterValue: any;
  locationData: any;
  workRightData: any;
  workPreferenceData: any;
  availabilityData: any;
  deactiveCount: any;

  constructor(private route: ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.gradForm = this.fb.group({
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]],

    })

    // Create 100 users
    const users = Array.from({ length: 50 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }

  ngOnInit(): void {
    this.selectedValue=''
    this.locationData = '';
    this.workRightData = '';
    this.workPreferenceData = '';
    this.availabilityData = ''
    this.filter = ''
    this.search = ''
    this.graduatelist();
    this.work_preference = ""
    this.availability = ""
    this.work_right = "";
    this.location = ""
  }

  select(event) {
    this.selectedValue = event.target.value
    this.graduatelist()

  }


  modal(id) {
    this.smallModal.show()
    this.delId = id
  }

  deletegraduate(id) {
    var obj = {
      deletedAt: true,
      user_id: id,
      role: "graduate",
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


  graduatelist() {
    var obj: any = {
      limit: this.limitOffset.limit,
      offset: this.limitOffset.offset,
      role: "Graduate",
      search: this.search,
      filter: this.selectedValue,
      //location: this.locationData,
      // availability: this.availabilityData,
      // work_right: this.workRightData,
      // work_preference: this.workPreferenceData
    }
    
    // if (this.main_filter && this.sub_filter) {
    //   obj[this.main_filter] = this.sub_filter
    // }
    if(this.locationData!=''){
      obj.location=this.locationData
    }
     if(this.availabilityData!=''){
      obj.availability=this.availabilityData
    }
    if(this.workRightData!=''){
      obj.work_right=this.workRightData
    }
    if(this.workPreferenceData!=''){
      obj.work_preference=this.workPreferenceData
    }
    this.Service.gradlist(obj).subscribe(data => {
      this.activeCount = data?.activeCount
      this.createdCount = data?.count
      this.deletedCount = data?.deletedCount
      this.deactiveCount = data?.deactiveCount
      this.gradlist = data.data;
      this.gradlistLocation = this.gradlist?.location?.name
      console.log("gradlist", this.gradForm);

      for (let i = 0; i < this.gradlist?.length; i++) {
        if (this.gradlist[i].availability == 'full_time') {
          let cType = "Full Time"
          this.gradlist[i].cType = cType
        }
        else if (this.gradlist[i].availability == "part_time") {
          let cType = 'Part Time'
          this.gradlist[i].cType = cType
        }
        else if (this.gradlist[i].availability == "temp_contract") {
          let cType = 'Temp/Contract'
          this.gradlist[i].cType = cType
        }

        if (this.gradlist[i].work_right?.work_right == '6229c90da69fcf8fc87e2827') {
          let workType = 'Permanent Resident/Citizen'
          this.gradlist[i].workType = workType
        }
        else if (this.gradlist[i].work_right?.work_right == "6229c917a69fcf8fc87e2828") {
          let workType = 'Full Time Work Rights'
          this.gradlist[i].workType = workType
        }
        else if (this.gradlist[i].work_right?.work_right == "6229c91fa69fcf8fc87e2829") {
          let workType = 'Student Visa'
          this.gradlist[i].workType = workType
        }
      }
      this.totalRecords = data.count
      this.sortedData = this.gradlist

      // for download csv
      this.jsonFpmMngt = []
      this.gradlist.forEach((res: any) => {
        this.jsonFpmMngt.push({
          first_name: res?.first_name,
          last_name: res?.last_name,
          email: res?.email,
          location: res?.location?.name,
          work_preference: res?.work_preference,
          availability: res?.availability,
          workType: res?.workType,
          profile_percentage: res?.profile_percentage,
          createdAt: moment(res?.createdAt).format('yyyy-MM-dd')
        })
      })

    }, err => {
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        console.log('Internet Connection Error')
      }
    })
  }

  paginationOptionChange(event) {
    this.limitOffset.offset = event.pageIndex * event.pageSize;
    this.limitOffset.limit = event.pageSize
    this.graduatelist()
  }
  getPageSizeOptions() {
    return [5, 10, 50, 100];
  }
  applyFilter(filterValue) {
    this.search = filterValue.target.value
    if (this.event) {
      this.paginationOptionChange(this.event)
    }
    else {
      this.graduatelist()
    }
  }

  selectfilter(e) {
    this.filtersData = e.target.value
    if (e.target.value == "Select Filter") {
      this.selectFilter = []
    }
    else if (e.target.value == "work_preference") {
      this.selectFilter = [
        { name: 'Internship', _id: "internship" },
        { name: 'Job', _id: "job" },
        { name: 'Any', _id: "any" },
        { name: 'Apprenticeship', _id: "apprenticeship" }

      ]
    }
    else if (e.target.value == "availability") {
      this.selectFilter = [
        { name: 'Any', _id: "any" },
        { name: 'Part Time', _id: "part_time" },
        { name: 'Full Time', _id: "full_time" },
        { name: 'Casual ', _id: "casual " },
        { name: 'Temp/Contract', _id: "temp_contract" }
      ]

    }
    else if (e.target.value == "work_right") {
      this.Service.getGradDropDown().subscribe(res => {
        this.selectFilter = res.data

      })
    }
    else if (e.target.value == "location") {
      var obj: any = {
        limit: this.limitOffset.limit,
        offset: this.limitOffset.offset,
        role: "Graduate",
        search: this.search,
        
      }
      this.Service.gradlist(obj).subscribe(res => {
        this.selectFilter = []
        res.data.map((val) => {
          this.selectFilter.push(val);
          console.log("location", this.selectFilter);
        })


      })
    }

  }
  selectsubfilter(e) {
    if (this.filtersData == 'location') {
      this.availabilityData='';
      this.workPreferenceData='';
      this.workRightData=''
      this.locationData = e.target.value;
      console.log("this.locationData", this.locationData);

    }
    else if (this.filtersData == 'work_right') {
      this.availabilityData='';
      this.workPreferenceData='';
      this.locationData=''
      this.workRightData = e.target.value
      console.log("this.workRightData", this.workRightData);

    }
    else if (this.filtersData == 'work_preference') {
      this.locationData='';
      this.workRightData='';
      this.availabilityData='';
      this.workPreferenceData = e.target.value;
      console.log("this.workPreferenceData", this.workPreferenceData);

    }
    else if (this.filtersData == 'availability') {
      this.locationData='';
      this.workRightData='';
      this.workPreferenceData='';
      this.availabilityData = e.target.value
    }

  }

  applyfilters() {
    // this.flag = true
    this.graduatelist()
  }




  cross() {
    this.gradForm.reset()
  }
  bulk() {
    this.gradForm.reset()
  }


  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.gradlist.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item.email) == -1) {
          this.selectedUser?.push(item.email);
        }
      });
    } else {
      this.gradlist.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.gradlist?.length) {
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
    if (this.gradForm.invalid) {
      this.gradForm.markAllAsTouched()
      this._snackBar.open('Please fill all the required fields ', 'close', {
        duration: 2000
      })
    }
    else if (this.selectedUser == '') {
      this._snackBar.open('Please select at least one email ', 'close', {
        duration: 2000
      })
    }
    else {
      var obj = {
        email: this.selectedUser,
        subject: this.gradForm.value.title,
        description: this.gradForm.value.description,
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
    this.downloadFile(this.jsonFpmMngt, "GraduateRecord", "graduateList");
  }
  // ---------- Download Function ------
  downloadFile(data: any, filename = "data", type = "string") {
    if (type == "graduateList") {
      this.csvData = this.ConvertToCSV(data, [
        "first_name",
        "last_name",
        "email",
        "location",
        "work_preference",
        "availability",
        "workType",
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

}

function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ';
  const email = EMAILS[Math.round(Math.random() * (EMAILS.length - 1))] + ' ';
  const company = CREATION[Math.round(Math.random() * (CREATION.length - 1))] + ' ';
  const location = LOCATION[Math.round(Math.random() * (LOCATION.length - 1))] + ' ';
  const wrkpref = WRKPREF[Math.round(Math.random() * (WRKPREF.length - 1))] + ' ';
  const availability = AVAILABILITY[Math.round(Math.random() * (AVAILABILITY.length - 1))] + ' ';
  const education = EDUCATION[Math.round(Math.random() * (EDUCATION.length - 1))] + ' ';
  const license = LICENSE[Math.round(Math.random() * (LICENSE.length - 1))] + ' ';
  const wrkrights = WRKRIGHTS[Math.round(Math.random() * (WRKRIGHTS.length - 1))] + ' ';
  const skills = SKILLS[Math.round(Math.random() * (SKILLS.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    name: name,
    email: email,
    company: company,
    lname: LNAME[Math.round(Math.random() * (LNAME.length - 1))],
    location: location,
    wrkpref: wrkpref,
    availability: availability,
    education: education,
    license: license,
    wrkrights: wrkrights,
    skills: skills,

  };
}
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface UserData {
  id: string;
  candidate: string;
  employer: string;
  jobtitle: string;
  interviewmethod: string;
  location: string;
  date: string;
  time: string;
}

/** Constants used to fill up our data base. */

const CANDIDATE: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi'
];
const EMPLOYER: string[] = [
  'Michael Smith', 'Amelia', 'IBM', 'Microsoft', 'Cora', 'Olivia', 'Levi', 'Michael', 'Oliver', 'Charlotte',
  'Levi', 'Isla', 'Olivia', 'Amelia', 'Michael Smith', 'IBM', 'Oliver', 'Isla', 'Levi'
];
const JOBTITLE: string[] = [
  'Lorem ipsum', 'Inappropriate text/attachments', 'Spam', 'Hateful speech', 'Harrassment'
];

const INTERVIEWMETHOD: string[] = [
  'Messaging', 'Jobs', 'Grad Applications'
];
const LOCATION: string[] = [
  'Melbourne', 'Melbourne', 'Melbourne', 'Melbourne', 'Melbourne', 'Melbourne'
];
const DATE: string[] = [
  '08-09-2021', '07-09-2021', '01-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021'
];
const TIME: string[] = [
  '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM', '12.00 PM - 01.00 PM'
];


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'employer', 'candidate', 'interviewmethod', 'jobtitle', 'location', 'date', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);
limit:any = 10;
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild('replyModal') public replyModal: ModalDirective;
  @ViewChild('blockModal') public blockModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortedData: any;
  totalRecords: any;
  topPage: any;
  ReplyForm: FormGroup;
  id: any;
  item_id: any;
  block_id: any;
  email_id: any;
  email: any;
  name: any;
  selectedUser: any = []
  type: any;

  constructor(private Service: TopgradserviceService, private fb: FormBuilder) {
    // Create 100 users
    const users = Array.from({ length: 50 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    this.ReplyForm = this.fb.group({
      reply: ['', Validators.required],
      email_to: ['', Validators.required],
      subject: ['', Validators.required],
    })
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getApplicationReports();

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  getApplicationReports() {
    var obj = {
      limit: 5,
      offset: 0
    }
    this.Service.ApplicationReports(obj).subscribe(data => {
      this.sortedData = data.data
      this.totalRecords = data.data.length
    })
  }

  paginationOptionChange(evt) {
    this.topPage = evt.pageIndex
    var obj: any = {
      limit: evt.pageSize,
      offset: (evt.pageIndex * evt.pageSize)
    }
    // if(this.search){
    //   obj.search = this.search

    // }
    this.Service.ApplicationReports(obj).subscribe(data => {
      this.sortedData = data.data
      this.totalRecords = data.data.length
    })
  }
  getPageSizeOptions() {
    return [5, 10, 25, 50, 100];

  }

  simple_reply(id) {
    this.id = id
    this.replyModal.show()

  }

  replyModal1() {

    this.replyModal.hide();
    this.ReplyForm.reset();
  }

  SendEmail(id) {
    if (this.ReplyForm.invalid) {
      this.ReplyForm.markAllAsTouched()
    }
    else {
      let index = this.sortedData.findIndex(x => x._id === id);

      var obj = {
        id: id,
        reply: this.ReplyForm.controls.reply.value,
        //reply_status:"replied",
        email: this.ReplyForm.controls.email_to.value,
        name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
        subject: this.ReplyForm.controls.subject.value
      }
      this.Service.ReportReply(obj).subscribe(res => {
        this.ngOnInit()
        this.replyModal.hide()
        this.ReplyForm.reset()
        this.Service.showMessage({ message: "Email Sent Successfully" })

      })
    }
  }

  // delete contact start..............
  delete_id(id) {
    this.item_id = id
    this.smallModal.show()
    this.ngOnInit()
  }

  ReportDelete(id) {

    var obj = {
      id: id
    }
    this.smallModal.hide()
    this.Service.ReportDelete(obj).subscribe(res => {
      this.ngOnInit()
      this.smallModal.hide()
      this.Service.showMessage({ message: "Deleted Successfully" })
    })
  }

  block_graduate(id,type:any) {
    this.block_id = id;
    this.blockModal.show()
    this.type=type
  }

  BlockProfile(id:any,type:any) {
    console.log("type>>>>",type);
    
    if(type == true){
      var obj = {
        user_id: id,
        blocked: false
      }
      this.blockModal.hide()
      this.Service.BlockGraduateProfile(obj).subscribe(res => {
        this.ngOnInit()
        this.smallModal.hide()
        this.Service.showMessage({ message: "Graduate profile unblocked successfully" })
      })
    }else if( type !=true){
      var obj = {
        user_id: id,
        blocked: true
      }
      this.blockModal.hide()
      this.Service.BlockGraduateProfile(obj).subscribe(res => {
        this.ngOnInit()
        this.smallModal.hide()
        this.Service.showMessage({ message: "Graduate profile blocked successfully" })
      })
    }

  }

  simple_email(id, type) {
    this.email_id = id
    let index2 = this.sortedData.findIndex(x => x._id === id);
    if (type == 'employer') {
      this.email = this.sortedData[index2].employer_detail.email;
      this.name = this.sortedData[index2].employer_detail.first_name + " " + this.sortedData[index2].employer_detail.last_name;
    }
    if (type == 'graduate') {
      this.email = this.sortedData[index2].graduate_detail.email;
      this.name = this.sortedData[index2].graduate_detail.first_name + " " + this.sortedData[index2].graduate_detail.last_name;
    }
    this.ReplyForm.patchValue({
      email_to: this.email
    });
    this.replyModal.show()
  }


  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.sortedData.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item._id) == -1) {
          this.selectedUser?.push(item._id);
        }
      });
    } else {
      this.sortedData.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.sortedData?.length) {
      return true;
    }

    return false;
  }

  selectUser(event, _id): void {
    if (event?.checked) {
      this.selectedUser?.push(_id);
    } else {
      var index = this.selectedUser?.indexOf(_id);
      this.selectedUser?.splice(index, 1);
    }
  }



}

function createNewUser(id: number): UserData {
  const candidate = CANDIDATE[Math.round(Math.random() * (CANDIDATE.length - 1))] + ' ';
  const employer = EMPLOYER[Math.round(Math.random() * (EMPLOYER.length - 1))] + ' ';
  const jobtitle = JOBTITLE[Math.round(Math.random() * (JOBTITLE.length - 1))] + ' ';
  const interviewmethod = INTERVIEWMETHOD[Math.round(Math.random() * (INTERVIEWMETHOD.length - 1))] + ' ';
  const location = LOCATION[Math.round(Math.random() * (LOCATION.length - 1))] + ' ';
  const date = DATE[Math.round(Math.random() * (DATE.length - 1))] + ' ';
  const time = TIME[Math.round(Math.random() * (TIME.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    candidate: candidate,
    employer: employer,
    jobtitle: jobtitle,
    interviewmethod: interviewmethod,
    location: location,
    date: date,
    time: time

  };

}

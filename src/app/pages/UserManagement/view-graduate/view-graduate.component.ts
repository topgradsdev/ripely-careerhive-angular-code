import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


export interface UserData {
  id: string;
  transid: string;
  amount: string;
  paid: string;
  balance: string;
  offer: string;
  startdate: string;
  subsexp: string;

}

/** Constants used to fill up our data base. */

const TRANSID: string[] = [
  'INV-65D9E592', 'INV-95D9E0897', 'INV-32D9E092'
];


const AMOUNT: string[] = [
  '195',
];

const PAID: string[] = [
  '195',
];

const BALANCE: string[] = [
  '0',
];


const OFFER: string[] = [
  'Basic Internship Agreement', 'Insurance and Agreement', 'Insurance Only'
];
const SDATE: string[] = [
  '08-09-2021', '07-09-2021', '01-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021'
];
const SUBSEXP: string[] = [
  '08-09-2021', '07-09-2021', '01-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021', '08-09-2021'
];

@Component({
  selector: 'app-view-graduate',
  templateUrl: './view-graduate.component.html',
  styleUrls: ['./view-graduate.component.scss']
})
export class ViewGraduateComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'transid', 'offer', 'startdate', 'subsexp', 'status', 'amount', 'paid', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  first_name: any;
  profiledata: any;
  monthName: any;
  monthName1: any;
  licenseMonthName: any;
  licenseEnddate: any;
  experienseStartDate: any;
  experienseEndDate: any;
  work_rightEndDate: any;
  image: any;
  workRight: string;
  videoUrl!: SafeResourceUrl;
  id;

  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute, 
    private Service: TopgradserviceService, private fb: FormBuilder, private router: Router,
    private sanitizer: DomSanitizer) {
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
    this.employerdetails();
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

  employerdetails() {
    var obj = {
      user_id: this.route.snapshot.paramMap.get('id')
    }
    this.Service.getEmployerDetail(obj).subscribe((resp) => {   
      console.log("resp>>>>>",resp);
      
      this.image = resp.data.image
      this.profiledata = resp.data;
      
      
      // this.videoUrl =this.sanitizer.bypassSecurityTrustResourceUrl(this.profiledata?.video_resume?.url);
      
      this.id=this.profiledata?.video_resume?.url.split("embed/")[1]
      

      // if(this.profiledata?.work_right?.work_right =='6229c90da69fcf8fc87e2827'){
      //   this.workRight="Permanent Resident/Citizen"

      // }else if(this.profiledata?.work_right?.work_right =='6229c917a69fcf8fc87e2828'){
      //   this.workRight="Full Time Work Rights"

      // }else if(this.profiledata?.work_right?.work_right =='6229c91fa69fcf8fc87e2829'){
      //   this.workRight="Student Visa"

      // }
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      for (let i = 0; i < this.profiledata?.work_experience.length; i++) {
        var date1 = new Date(this.profiledata?.work_experience[i]?.start_year, this.profiledata?.work_experience[i]?.start_month, 0);
        if (this.profiledata.work_experience[i].still_in_role == true) {
          var date2 = new Date();
          this.monthName = months[date1.getMonth()]; // "July" (or current month)
          this.profiledata.work_experience[i].monthName = this.monthName
        }
        else {
          var date2 = new Date(this.profiledata?.work_experience[i]?.end_year, this.profiledata?.work_experience[i]?.end_month, 0);
          this.monthName1 = months[date2.getMonth()]; // "July" (or current month)
          this.profiledata.work_experience[i].lastMonthName = this.monthName1
        }
        var Time = (date2.getTime() - date1.getTime()) / 1000;
        var Months = Time / (60 * 60 * 24 * 7 * 4); //Diference in Days
        this.profiledata.work_experience[i].ServingMonths = Math.floor(Months)
      }
      for (let i = 0; i < this.profiledata?.licenses.length; i++) {
        var f = new Date(this.profiledata?.licenses[i]?.issuing_year, this.profiledata?.licenses[i]?.issuing_month, 0);
        this.licenseMonthName = months[f?.getMonth()]; // "July" (or current month)
        this.profiledata.licenses[i].issuingMonthName = this.licenseMonthName
        var g = new Date(this.profiledata?.licenses[i]?.expiry_year, this.profiledata?.licenses[i]?.expiry_month, 0);
        this.licenseEnddate = months[g?.getMonth()]; // "July" (or current month)
        this.profiledata.licenses[i].expiryMonthName = this.licenseEnddate
      }
      for (let i = 0; i < this.profiledata?.volunteer_experience.length; i++) {
        var h = new Date(this.profiledata?.volunteer_experience[i]?.start_year, this.profiledata?.volunteer_experience[i]?.start_month, 0);
        this.experienseStartDate = months[h?.getMonth()]; // "July" (or current month)
        this.profiledata.volunteer_experience[i].startMonthName = this.experienseStartDate
        var j = new Date(this.profiledata?.volunteer_experience[i]?.end_year, this.profiledata?.volunteer_experience[i]?.end_month, 0);
        this.experienseEndDate = months[j?.getMonth()]; // "July" (or current month)
        this.profiledata.licenses[i].endMonthName = this.experienseEndDate
      }
      var k = new Date(this.profiledata?.work_right?.expiry_year, this.profiledata?.work_right?.expiry_month, 0);
      this.work_rightEndDate = months[j?.getMonth()]; // "July" (or current month)
      this.profiledata.work_right.work_expiry = this.work_rightEndDate
    })
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

}



function createNewUser(id: number): UserData {
  const transid = TRANSID[Math.round(Math.random() * (TRANSID.length - 1))] + ' ';
  const amount = AMOUNT[Math.round(Math.random() * (AMOUNT.length - 1))] + ' ';
  const paid = PAID[Math.round(Math.random() * (PAID.length - 1))] + ' ';
  const balance = BALANCE[Math.round(Math.random() * (BALANCE.length - 1))] + ' ';
  const offer = OFFER[Math.round(Math.random() * (OFFER.length - 1))] + ' ';
  const startdate = SDATE[Math.round(Math.random() * (SDATE.length - 1))] + ' ';
  const subsexp = SUBSEXP[Math.round(Math.random() * (SUBSEXP.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    transid: transid,
    amount: amount,
    paid: paid,
    balance: balance,
    offer: offer,
    startdate: startdate,
    subsexp: subsexp

  };
}


import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';


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
  selector: 'app-view-employer',
  templateUrl: './view-employer.component.html',
  styleUrls: ['./view-employer.component.scss']
})
export class ViewEmployerComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'transid', 'offer', 'startdate', 'subsexp', 'status', 'amount', 'paid', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);
  
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  EmployerDetails = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.maxLength(50)]],
    company_name: ['', [Validators.required, Validators.maxLength(50)]],
    job_title: ['', [Validators.required, Validators.maxLength(50)]],
    creation_date: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(50)]],
    status: ['', [Validators.required, Validators.maxLength(50)]],
    Image: ['',],
    county:['']
  });
  imageFile: any;



  constructor(private _snackBar: MatSnackBar, private route:ActivatedRoute,private Service:TopgradserviceService, private fb:FormBuilder, private router: Router ) { 
  	// Create 100 users
    const users = Array.from({length: 50}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.employerdetails();
    this.jobTitleList();

    this.searchControl.valueChanges.subscribe((searchText: string) => {
      this.filteredOptions = this._filterOptions(searchText);
    });
  }


  private _filterOptions(searchText: string): string[] {
    const lowerSearchText = searchText.toLowerCase();
    return this.jobTitles.filter(option => option.name.toLowerCase().includes(lowerSearchText) || option.code.toString().toLowerCase().includes(lowerSearchText));
  }
  filteredOptions: string[];
  searchControl = new FormControl();
  jobTitles:any = [];

  jobTitleList() {
    let param = { search: '' };
    this.Service.getJobTitle(param).subscribe(res => {
      res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.jobTitles = res.data;
      this.filteredOptions = this.jobTitles;
    })

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

  employerdetails(){
    var obj = {
      user_id: this.route.snapshot.paramMap.get('id')
    }
    this.Service.getEmployerDetail(obj).subscribe((resp) => {
      console.log("employer detail is ====>", resp)
      this.imageFile=resp.data.image

      this.EmployerDetails.patchValue({
        first_name: resp.data.first_name,
        last_name: resp.data.last_name,
        email:resp.data.email,
        company_name: resp.data.company_name,
        job_title: resp.data.role,
        password: resp.data.password,
        creation_date: resp.data.createdAt,
        status: resp.data.status
      })
      console.log("forrmmmmmmmm==========>",this.EmployerDetails);
      
    }) 
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


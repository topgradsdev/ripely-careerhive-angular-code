import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pipe, PipeTransform } from '@angular/core';

export interface UserData {
  id: string;
  title: string;
  // category: string;
  description: string;
}


/** Constants used to fill up our data base. */

const TITLE: string[] = [
  'How do I keep track of a b c?', 'Lorem ipsum dolor sit?'
];
const LASTNAME: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
// const CATEGORY: string[] = [
//   'General', 'My Account', 'Jobs', 'Permissions & Privacy', 
// ];

const DESCRIPTION: string[] = [
  'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 
];



@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
// @Pipe({
//   name: 'limitTo'
// })

export class TermsConditionsComponent implements OnInit {
limit:any = 10;
  displayedColumns: string[] = ['select', 'id', 'title', 'description', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);
  
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  termslist: any=[];
  totalRecords: any;
  delId: any;
  event: any;
  topPage: any;
  selectedUser:any=[]
  limitOffset:any={
    limit:10,
    offset:0
  }


  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _snackBar: MatSnackBar ) { 

    const users = Array.from({length: 50}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.termslist);

  }

  // transform(value: string, args: string) : string {
  //   // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
  //   // let trail = args.length > 1 ? args[1] : '...';
  //   let limit = args ? parseInt(args, 10) : 10;
  //   let trail = '...';

  //   return value.length > limit ? value.substring(0, limit) + trail : value;
  // }

  ngOnInit(): void {
    this.termsconditionlist();
  }

  termsconditionlist(){
    var obj = {
    limit:this.limitOffset.limit,
    offset:this.limitOffset.offset,
    type: "terms"
    }
    console.log("onnnn", obj)
    this.Service.termslist(obj).subscribe(data => {
    console.log("main data for terms is ====", data)
    this.termslist=data.data
    this.totalRecords=data.count;
    }, err => {
    console.log(err.status)
    if (err.status >= 404) {
    console.log('Some error occured')
    } else {
    // this.toastr.error('Some error occured, please try again!!', 'Error')
    console.log('Internet Connection Error')
    }
    })
  }
  modal(id){
    this.smallModal.show()
    this.delId=id
  }
  

  deleteheading(id){
    var obj = {
      content_id: id
    }
    this.Service.deleteterm(obj).subscribe(res=>{
      console.log("fgdgfdgfdfgdfgd",res);
      this.smallModal.hide()
      if(res.code==200){
        this._snackBar.open("Heading Deleted Successfully","close",{
          duration: 2000
        });
        this.ngOnInit()
      }
    },err => {
      console.log(err);
      this._snackBar.open("Some Error Occued","close",{
        duration: 2000})
      })
  }

  paginationOptionChange(event:any) {
    this.limitOffset.offset = event.pageIndex * event.pageSize;
    this.limitOffset.limit = event.pageSize
    this.termsconditionlist();
  }
  getPageSizeOptions() {
    return [5,10,50,100];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.termslist.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item._id) == -1) {
          this.selectedUser?.push(item._id);
        }
      });
    } else {
      this.termslist.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.termslist?.length) {
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

}

function createNewUser(id: number): UserData {
  const title = TITLE[Math.round(Math.random() * (TITLE.length - 1))] + ' ';
  // const category = CATEGORY[Math.round(Math.random() * (CATEGORY.length - 1))] + ' ';
  const description = DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))] + ' ';
  

  return {
    id: id.toString() + '.',
    title: title,
    description: description,

  };
}
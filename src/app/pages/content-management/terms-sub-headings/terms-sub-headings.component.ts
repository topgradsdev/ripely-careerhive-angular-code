import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  selector: 'app-terms-sub-headings',
  templateUrl: './terms-sub-headings.component.html',
  styleUrls: ['./terms-sub-headings.component.scss']
})
export class TermsSubHeadingsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'title', 'description', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);
  
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subheadinglist: any=[];
  totalRecords: any;
  heading_id: any;
  delId: any;
  type: any;


  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _snackBar: MatSnackBar ) {
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
    this.termssubheadings();
    this.heading_id=this.route.snapshot.paramMap.get('id');
    this.type= this.route.snapshot.paramMap.get('type');
  }

  termssubheadings(){
    console.log("khjhgjhgjhgjhghjghjgjhghjg");
    
    var obj = {
      content_id:this.route.snapshot.paramMap.get('id')
    }
    console.log("onnnn", obj)
    this.Service.termsheading(obj).subscribe(data => {
    console.log("main data for terms sub headings is ====", data)
    this.subheadinglist=data.data.heading?.sub_headings
    this.totalRecords=data.length;
    this.heading_id=obj.content_id;
    console.log(this.subheadinglist);
    console.log("heading_id",this.heading_id);
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

  deletesubheading(id){
    var obj = {
      content_id:this.route.snapshot.paramMap.get('id'),
      sub_heading_id: id
    }
    this.Service.deletetermsubheading(obj).subscribe(res=>{
      console.log("fgdgfdgfdfgdfgd",res);
      this.smallModal.hide()
      if(res.code==200){
        this._snackBar.open("Sub Heading Deleted Successfully","close",{
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

}

function createNewUser(id: number): UserData {
  const title = TITLE[Math.round(Math.random() * (TITLE.length - 1))] + ' ';
  // const category = CATEGORY[Math.round(Math.random() * (CATEGORY.length - 1))] + ' ';
  const description = DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))] + ' ';
  

  return {
    id: id.toString() + '.',
    title: title,
    // category: category,
    description: description,

  };
}

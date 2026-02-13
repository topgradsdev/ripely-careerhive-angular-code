import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { ToastrService } from 'ngx-toastr';

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
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {


  displayedColumns: string[] = ['select', 'id', 'title', 'description', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  privacyform:FormGroup
  title: any;
  description: any;
  policylist: any;
  totalRecords: any;
  delId: any;
  sortedData: any;
  search: any='';
  topPage: any;
  event: any;
  selectedUser:any=[]
  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _snackBar: MatSnackBar ) { 
    
    const users = Array.from({length: 50}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.policylist);
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }

  ngOnInit(): void {
     this.privacypolicylist();
  }

  privacypolicylist(){
    console.log("khjhgjhgjhgjhghjghjgjhghjg");
    
    var obj = {
    limit:10,
    offset:0,
    type: "privacy"
    }
    console.log("onnnn", obj)
    this.Service.termslist(obj).subscribe(data => {
    console.log("main data for privacy is ====", data)
    // this.sortedData = res.data
    //   this.totalRecords = res.count
    this.policylist=data.data
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

  paginationOptionChange(evt) {
    this.event=evt
    console.log("evthrm", evt)
    this.topPage = evt.pageIndex
    console.log('rsawsfsdsf',this.topPage)
    console.log("pagesize is======",evt.pageSize);
    
   var obj:any = {
     // search:this.search,
      limit: evt.pageSize,
      offset: (evt.pageIndex*evt.pageSize),
      type: "privacy"
    }
    //  if(this.search){
    //   obj.search = this.search
    // }
    console.log("paginator obj==========",obj);
    
     this.Service.termslist(obj).subscribe(async data => {
        console.log("main data for privacy is ====", data)
        this.policylist=data.data
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
  getPageSizeOptions() {
    return [5,10,50,100];
  }

  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.policylist.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item._id) == -1) {
          this.selectedUser?.push(item._id);
        }
      });
    } else {
      this.policylist.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.policylist?.length) {
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

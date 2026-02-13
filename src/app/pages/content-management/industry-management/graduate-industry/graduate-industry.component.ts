
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

export interface UserData {
  id: string;
  name: string;
}
const NAMES: string[] = [
];


@Component({
  selector: 'app-graduate-industry',
  templateUrl: './graduate-industry.component.html',
  styleUrls: ['./graduate-industry.component.scss']
})

export class GraduateIndustryComponent implements OnInit {
  name: string
  userList = []
  displayedColumns: string[] = ['select', 'id', 'name', 'action'];
  dataSource: MatTableDataSource<UserData>;

  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalRecords: any;
  addForm: FormGroup;
  editForm: FormGroup;
  list: void;
  userlist: any;
  length: any;
  sortedData: any;
  search: any;
  topPage: any;
  graduateListing: any;
  event: any;
  id: any;
  toastr: any;
  name1: any = [];
  user: any;
  item_id: any;
  selectedUser:any=[]
  constructor(private Service: TopgradserviceService, public dialog: MatDialog, private fb: FormBuilder, private route: ActivatedRoute) {

    this.addForm = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
    })
    this.editForm = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
    })

    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); };
    this.dataSource = new MatTableDataSource(users);
    this.sortedData = this.graduateListing?.slice();
  }


  sortData(sort: Sort) {
    const data = this.graduateListing.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'name':
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.search = ''
    this.graduateList();
    this.name = ""
  }

  openSnackBar() {
    this.id = this.id
  }
  
  editModalRemove() {
    this.editModal.hide()
    this.editForm.reset()
  }

  industryId() {
    var obj = {
      industry_id: this.id
    }
    console.log("industry iddddd===>>", obj)
    this.Service.addEditIndustryDetail(obj).subscribe(data => {
      console.log("detailsssss====", data)
      this.user = data.data
      this.name1 = this.user.name
    }, err => {
      console.log(err.status)
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        this.toastr.error('Some error occured, please try again!!', 'Error')
        console.log('Internet Connection Error')
      }
    })
  }

  edit_industry(id) {
    console.log("edittttttttttttttt===>>>", id)
    this.id = id
    this.editModal.show()
    this.industryId()

  }



  addIndustry(id) {
    console.log("formmmmmmmmmmmm", this.addForm);
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
    }
    else {
      var obj: any = {
        type: 'graduate',
        name: this.addForm.controls.name.value,
        industry_id: this.id
      }
      if (this.id) {
        obj.industry_id = id
      }
      console.log("Adddddd=========>", obj);
      this.Service.addIndustry(obj).subscribe(res => {
        console.log("Response==========", res);
        this.Service.showMessage({ message: "Added Successfully" })
        this.ngOnInit()
        this.addModal.hide()
        this.editModal.hide()
        this.addForm.reset()
      })
    }
  }

  EditIndustry(id) {
    console.log("formmmmmmmmmmmm", this.addForm);
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
    }
    else {
      var obj: any = {
        type: 'graduate',
        name: this.addForm.controls.name.value,
        industry_id: this.id
      }
      if (this.id) {
        obj.industry_id = id
      }
      console.log("Adddddd=========>", obj);
      this.Service.addIndustry(obj).subscribe(res => {
        console.log("Response==========", res);
        this.Service.showMessage({ message: "Updated Successfully" })
        this.ngOnInit()
        this.addModal.hide()
        this.editModal.hide()
        this.addForm.reset()
      })
    }
  }
  addModalRemove() {
    this.addModal.hide()
    this.addForm.reset()
  }


  paginationOptionChange(evt) {
    console.log("evthrm", evt)
    this.event = evt
    this.topPage = evt.pageIndex
    console.log('rsawsfsdsf', this.topPage)
    var obj: any = {
      type: 'graduate',
      limit: evt.pageSize,
      offset: (evt.pageIndex * evt.pageSize),
      search: this.search
    }

    this.Service.industryList(obj).subscribe(async res => {
      console.log("Response of all the service listing>>>>>", res);
      this.graduateListing = res.data,
        this.sortedData = this.graduateListing
      this.totalRecords = res.count
    })
  }
  getPageSizeOptions() {
    return [5, 10, 50, 100];
  }


  graduateList() {
    console.log("javascriptt========");
    var obj: any = {
      type: 'graduate',
      limit: 5,
      offset: 0,
      search: this.search
    }

    console.log("object===>", obj);

    this.Service.industryList(obj).subscribe(res => {
      console.log("Response==========", res);
      this.graduateListing = res.data
      this.sortedData = this.graduateListing
      this.totalRecords = res.count
    })
    console.log("Object==========");
  }



  delete_id(id){
    this.item_id=id
    this.smallModal.show()
    console.log("industry name",this.item_id);
    this.ngOnInit()
  }
  industryGraduateDelete(id){
    var obj={
      industry_id:id
    }
    console.log("deleted industry",obj);
    this.smallModal.hide()
    this.Service.industryDelete(obj).subscribe(res=>{
      console.log("Response==========",res);
      this.Service.showMessage({ message: "Deleted Successfully" })
      this.ngOnInit()
      this.smallModal.hide()
    })
  }

  selectAll(e) {
    const checked = e?.checked;
    if (checked) {
      this.graduateListing.forEach((item) => {
        item.checked = true;
        if (this.selectedUser?.indexOf(item._id) == -1) {
          this.selectedUser?.push(item._id);
        }
      });
    } else {
      this.graduateListing.forEach((item) => {
        item.checked = false;
        this.selectedUser = [];
      });
    }
  }

  findChecked() {
    if (this.selectedUser?.length == this.graduateListing?.length) {
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



  applyFilter(filterValue) {
    this.search = filterValue.target.value
    if (this.event) {
      this.paginationOptionChange(this.event)
    }
    else {
      this.graduateList()

    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ';
  return {
    id: id.toString() + '.',
    name: name,

  };
}

function compare(a: string, b: string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



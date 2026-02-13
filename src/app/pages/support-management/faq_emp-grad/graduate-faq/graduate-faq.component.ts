import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';
import { TopgradserviceService } from '../../../../topgradservice.service';


export interface UserData {
  id: string;
  title: string;
  category: string;
  description: string;
}

/** Constants used to fill up our data base. */

const TITLE: string[] = [
  'How do I keep track of a b c?', 'Lorem ipsum dolor sit?'
];

const CATEGORY: string[] = [
  'General', 'My Account', 'Jobs', 'Permissions & Privacy', 
];

const DESCRIPTION: string[] = [
  'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 
];

@Component({
  selector: 'app-graduate-faq',
  templateUrl: './graduate-faq.component.html',
  styleUrls: ['./graduate-faq.component.scss']
})
export class GraduateFaqComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'category', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);
    
  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  GraduateFaqList: any;
  totalRecords: any;
  topPage: any;
  sortedData: any;
  search: string;
  filterValue: string;
  item_id: any;

  constructor( private Service:TopgradserviceService,  private fb : FormBuilder) {

    const users : UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); };
    this.dataSource = new MatTableDataSource(users);
    this.sortedData = this.GraduateFaqList?.slice();
  }

  sortData(sort: Sort) {
    const data = this.GraduateFaqList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
        return compare(a.id, b.id, isAsc);
        case 'title':
        return compare(a.id, b.id, isAsc);
        case 'category':
        return compare(a.id, b.id, isAsc);
        case 'description':
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
    // alert("hgsxcjhs");
    this.faqList();
  }
  paginationOptionChange(evt) {
    console.log("evthrm", evt)
    this.topPage = evt.pageIndex
    console.log('rsawsfsdsf',this.topPage)
    var obj:any = {
      user_type:'graduate',
      limit: evt.pageSize,
      offset:  (evt.pageIndex * evt.pageSize)
    }
    if(this.search){
      obj.search = this.search
     
    }
    this.Service.faqList(obj).subscribe(async data => {
      console.log("Response of all the service listing>>>>>", data);
      this.GraduateFaqList=data.data,
      this.sortedData=this.GraduateFaqList
      this.totalRecords = data.count
    })
  }
  getPageSizeOptions() {
    return [5,10,25,50,100];
    
  }
  
  faqList(){
    console.log("javascriptt========");
    var obj: any={
      user_type:'graduate',
      limit:5,
      offset:0,
    }
    if(this.search){
      obj.search = this.search
     
    }
    this.Service.faqList(obj).subscribe(res=>{
        console.log("Response==========",res);
        this.GraduateFaqList=res.data
        this.sortedData=this.GraduateFaqList
        this.totalRecords = res.count
      })
      console.log("Object==========",obj);
    }


    applyFilter(filterValue: string ) {
      this.faqList()
    }

    delete_id(id){
      this.item_id=id
      this.smallModal.show()

    }
    faqDelete(id){
      var obj={
        faq_id:id
      }
      console.log("adsdsadsadsds",obj);
      this.smallModal.hide()
      this.Service.faqDelete(obj).subscribe(res=>{
        console.log("Response==========",res);
        this.ngOnInit()
        this.smallModal.hide()
        this.Service.showMessage({ message: "Deleted Successfully" })
      })
    }

}

function createNewUser(id: number): UserData {
  const title = TITLE[Math.round(Math.random() * (TITLE.length - 1))] + ' ';
  const category = CATEGORY[Math.round(Math.random() * (CATEGORY.length - 1))] + ' ';
  const description = DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))] + ' ';
  

  return {
    id: id.toString() + '.',
    title: title,
    category: category,
    description: description,

  };
}

function compare(a: string, b: string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


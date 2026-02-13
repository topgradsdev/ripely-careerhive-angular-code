import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';

export interface UserData {
  id: string;
  image: string;
  title: string;
  type: string;
  // description: string;
  postedBy: string;

}

/** Constants used to fill up our data base. */
const IMAGE: string[] = [
  'assets/img/blog-article.png', 'assets/img/blog3_bg.png'
];
const TITLE: string[] = [
  'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Web Development', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors'
];
const TYPE: string[] = [
  'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Web Development', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors', 'Career Counsellors'
];
// const DESCRIPTION: string[] = [
//   'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 'Lorem ipsum sit donar Lorem ipsum sit donar', 
// ];
const POSTEDBY: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {


  displayedColumns: string[] = ['select', 'image', 'postedBy', 'postDate', 'title', 'category', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('deleteArticleModal') public deleteArticleModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortedData: any;
  totalRecords: any;
  article: any;
  delId: any;
  search: any = '';
  topPage: any;
  event: any;
  categoryName: string;
  offset: number = 0;
  selectedUser: any = []
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }
  constructor(private Service: TopgradserviceService, public dialog: MatDialog, private fb: FormBuilder, private route: ActivatedRoute) {
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
    this.articleList();
    this.search = '';
  }

  applyFilter(filterValue) {

    this.search = filterValue.target.value

    // console.log("after searchhhhh-00------------0=====", this.event);

    if (this.event) {
      // console.log("after searchhhhh=====", this.event);

      this.paginationOptionChange(this.event)
    }
    else {
      this.articleList()

    }

  }

  paginationOptionChange(evt) {
    this.event = evt
    // console.log("evthrm", evt)
    this.topPage = evt.pageIndex
    // console.log('rsawsfsdsf',this.topPage)
    // console.log("pagesize is======",evt.pageSize);
    this.offset = evt.pageIndex * evt.pageSize
    var obj: any = {
      search: this.search,
      limit: evt.pageSize,
      offset: (evt.pageIndex * evt.pageSize)
    }
    //  if(this.search){
    //   obj.search = this.search
    // }
    // console.log("paginator obj==========", obj);

    this.Service.getarticleList(obj).subscribe(async data => {
      // console.log("Response of all the service listing>>>>>", data);
      this.sortedData = data.data
      this.totalRecords = data.count
      // console.log("sorted data output", this.sortedData)
      for (let i = 0; i < this.sortedData.length; i++) {
        var new_article = this.sortedData[i].article_type
        var type_category = this.sortedData[i]?.category
        console.log("type_category  outside    =======>>>", type_category);

        console.log("new_article=============>", new_article)
        //   if(new_article =="small_article"){
        //     this.article= "Small Article"
        //     console.log("this.article small===========>",this.article);
        //     this.sortedData[i].article_name=(this.article);

        //   }
        //   else if(new_article == "large_article"){
        //     this.article= "Large Article"
        //     console.log("this.article large===========>",this.article);
        //     this.sortedData[i].article_name=(this.article);
        //   }

        if (type_category == 'resumes') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Resumes'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'cover_letters') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Cover Letters'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'internships') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Internships'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_interviews') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Job Interviews'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_trends') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Job Trends'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'linked_in') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Linked In'
          this.sortedData[i].category_name = (this.categoryName);
        }
      }
    }, err => {
      console.log(err.status)
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        console.log('Internet Connection Error')
      }

    })
  }
  getPageSizeOptions() {
    return [5, 10, 50, 100];
  }

  Modal(id) {
    this.delId = id;
    this.deleteArticleModal.show();
  }

  deleteArticle(id) {
    var obj = {
      article_id: id
    }
    this.Service.delArticle(obj).subscribe(res => {
      console.log("Response==========", res);
      this.deleteArticleModal.hide();
      this.Service.showMessage({ message: "Deleted Successfully" });
      this.ngOnInit();
    })
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


  articleList() {
    console.log("javascriptt========");
    var obj: any = {
      limit: 5,
      offset: 0,
      article_type: "article",
      search: this.search,
      // search: this.search
    }

    console.log("object===>", obj);

    this.Service.getarticleList(obj).subscribe(res => {
      console.log("Response==========22", res);
      this.sortedData = res.data
      console.log("sorted data output", this.sortedData)
      this.totalRecords = res.count
      for (let i = 0; i < this.sortedData.length; i++) {
        var new_article = this.sortedData[i].article_type
        var type_category = this.sortedData[i]?.category
        console.log("type_category  outside    =======>>>", type_category);

        console.log("new_article=============>", new_article)
        // if(new_article =="small_article"){
        //   this.article= "Small Article"
        //   console.log("this.article small===========>",this.article);
        //   this.sortedData[i].article_name=(this.article);

        // }
        // else if(new_article == "large_article"){
        //   this.article= "Large Article"
        //   console.log("this.article large===========>",this.article);
        //   this.sortedData[i].article_name=(this.article);
        // }

        if (type_category == 'resumes') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Resumes'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'cover_letters') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Cover Letters'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'internships') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Internships'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_interviews') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Job Interviews'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_trends') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Job Trends'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'linked_in') {
          console.log("type_category  inside condition    =======>>>", type_category);
          this.categoryName = 'Linked In'
          this.sortedData[i].category_name = (this.categoryName);
        }
      }

    }, err => {
      console.log(err.status)
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        console.log('Internet Connection Error')
      }

    })
    console.log("Object==========");
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
  const image = IMAGE[Math.round(Math.random() * (IMAGE.length - 1))] + ' ';
  const title = TITLE[Math.round(Math.random() * (TITLE.length - 1))] + ' ';
  const type = TYPE[Math.round(Math.random() * (TYPE.length - 1))] + ' ';
  const postedBy = POSTEDBY[Math.round(Math.random() * (POSTEDBY.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    image: image,
    title: title,
    type: type,
    postedBy: postedBy
  };
}
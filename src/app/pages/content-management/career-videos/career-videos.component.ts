import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

export interface UserData {
  id: string;
  image: string;
  title: string;
  type: string;
  //description: string;
  postedBy: string;
}

/** Constants used to fill up our data base. */
const IMAGE: string[] = [
  'assets/img/grads.png', 'assets/img/success.png'
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
  selector: 'app-career-videos',
  templateUrl: './career-videos.component.html',
  styleUrls: ['./career-videos.component.scss']
})
export class CareerVideosComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'image', 'postedBy', 'title', 'category', 'action'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild('smallModal') public smallModal: ModalDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortedData: any;
  totalRecords: any;
  article: any;
  delId: any;
  search: any = '';
  topPage: any;
  event: any;
  video: any;
  video_url: any;
  image_url: any;
  image: any;
  categoryName: string;
  offset: number = 0;
  selectedUser: any = []
  limit:any = 10;

  matObj={
    limit:10,
    offset:0
  }


  constructor(private Service: TopgradserviceService, private sanitizer: DomSanitizer, public dialog: MatDialog, private fb: FormBuilder, private route: ActivatedRoute) {
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
    if (this.event) {
      this.paginationOptionChange(this.event)
    }
    else {
      this.articleList()

    }

  }

  paginationOptionChange(event) {
   this.matObj.offset = event.pageIndex * event.pageSize;
    this.matObj.limit = event.pageSize
    this.articleList();
  }
  getPageSizeOptions() {
    return [5, 10, 50, 100];
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

  Modal(id) {
    this.delId = id;
    this.smallModal.show();
  }

  deleteArticle(id) {
    var obj = {
      article_id: id
    }
    this.Service.delArticle(obj).subscribe(res => {
      this.smallModal.hide();
      this.Service.showMessage({ message: "Deleted Successfully" });
      this.ngOnInit();
    })
  }

  articleList() {
    var obj: any = {
      limit: this.matObj.limit,
      offset: this.matObj.offset,
      type: "video",
      search: this.search
      // search: this.search
    }
    this.Service.getvideoList(obj).subscribe(res => {
      this.sortedData = res.data
      this.totalRecords = res.count
      for (let i = 0; i < this.sortedData.length; i++) {
        var new_article = this.sortedData[i].article_type
        var type_category = this.sortedData[i]?.category
        if (new_article == "small_video_article") {
          this.article = "Small Video"
          this.sortedData[i].article_name = (this.article);
          this.image = this.sortedData[i].medias.find(x => x.for == 'main');
          this.image_url = this.image?.url
          this.sortedData[i].url = (this.image_url);

        }
        else if (new_article == "large_video_article") {
          this.article = "Large Video"
          this.sortedData[i].article_name = (this.article);
          this.video = this.sortedData[i].medias.find(x => x.for == 'video');
          this.video_url = this.video?.url
          if (this.video_url && this.video_url.includes("youtube")) {
            this.sortedData[i].url = (this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url));
          } else {
            this.sortedData[i].url = (this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url));
          }
        }

        if (type_category == 'resumes') {
          this.categoryName = 'Resumes'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'cover_letters') {
          this.categoryName = 'Cover Letters'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'internships') {
          this.categoryName = 'Internships'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_interviews') {
          this.categoryName = 'Job Interviews'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'job_trends') {
          this.categoryName = 'Job Trends'
          this.sortedData[i].category_name = (this.categoryName);
        }
        if (type_category == 'linked_in') {
          this.categoryName = 'Linked In'
          this.sortedData[i].category_name = (this.categoryName);
        }
      }
    }, err => {
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
        console.log('Internet Connection Error')
      }

    })
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
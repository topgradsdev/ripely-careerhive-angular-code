import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  paginator: boolean | undefined = false;
  @Input() paginationObj: any;
  @Output() pagination = new EventEmitter();
  @ViewChild(MatPaginator) paginatorEvent: MatPaginator | undefined;
  constructor() { }

  ngOnChanges() {
    if(this.paginationObj.changed){
      if (this.paginatorEvent) {
        this.paginatorEvent.firstPage();
      }
    }
    
  }
  ngOnInit(): void {
  }
  onPaginatorShow (){
    this.paginator = !this.paginator
  }

  handlePageEvent(event:any) {
    this.pagination.emit(event);
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-email-template-attachment',
  templateUrl: './email-template-attachment.component.html',
  styleUrls: ['./email-template-attachment.component.scss']
})
export class EmailTemplateAttachmentComponent implements OnInit {
  @Input() data: any;
  media:any =[];
  selected = false;
  @Output() action = new EventEmitter();
  element: any = {
   
  }
  constructor(private service: TopgradserviceService) { }

  ngOnInit(): void {
    if (Object.keys(this.data?.elementData).length > 1) {
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
      console.log("this.element", this.element);
      if(this.element.attachments && this.element.attachments.length>0){
        this.media = this.element.elementData.attachments;
      }
    }
    // console.log("data", this.data, this.data.elementData, this.data.elementData.attachments);
    if(this.data && this.data.elementData && this.data.elementData.attachments ){
      this.media = this.data.elementData.attachments;
      // console.log("media", this.media);
    }
  }

  // ngOnChanges(): void {
  //   console.log("data", this.data);
  //   if(this.data && this.data.elementData && this.data.elementData.attachments ){
  //     this.media = this.data.elementData.attachments;
  //   }
  // }

  toggleElement() {
    if (this.data.elementData.insideSection) {
      return;
    }
    this.selected = !this.selected;
  }

  deleteElement() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  copyElement() {
    this.data.actionType = 'copy';
    this.action.emit(this.data);
  }

  save() {
   this.element.attachments = this.media;
    this.data.elementData = this.element;



    this.action.emit(this.data);
  }

  files = [];
  
  getFilDoc(event) {
    if (event.target.files[0].size > 3145728) {
        this.service.showMessage({
          message: 'Please select file less than 3 MB'
        });
        return;
      }
      this.files = event.target.files;
      // this.media = [];
      this.files.forEach(file => {
        const formData = new FormData();
        formData.append('media', file);
        this.service.uploadMedia(formData).subscribe((resp: any) => {
          this.media.push(resp);
          this.save();
        });
      });
  }

  removeFile(index) {
    this.media.splice(index, 1);
  }
}

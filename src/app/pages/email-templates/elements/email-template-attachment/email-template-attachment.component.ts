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
  
  getFilDoc(event: any) {
    const fileInput = event.target;
    const fileList: FileList = fileInput.files;

    if (!fileList || fileList.length === 0) return;

    // Convert FileList to an array
    const filesArray = Array.from(fileList);

    filesArray.forEach((file) => {
      if (file.size > 3145728) { // 3 MB in bytes
        this.service.showMessage({
          message: `File "${file.name}" exceeds 3 MB. Please select a smaller file.`,
        });
        return;
      }

      const formData = new FormData();
      formData.append('media', file);

      this.service.uploadMedia(formData).subscribe((resp: any) => {
        this.media.push(resp);
        this.save(); // If you want to save on each file upload
      });
    });

    // Clear input to allow re-selecting same file
    fileInput.value = '';
  }


  removeFile(index) {
    this.media.splice(index, 1);
  }
}

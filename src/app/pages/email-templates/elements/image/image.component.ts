import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @Output() action = new EventEmitter();

  element: any = {
    height: 100,
    width: 100,
    transparency: 100,
    image: "",
    imageName: ""
  }

  constructor(private service: TopgradserviceService) { }

  ngOnInit(): void {
    if (Object.keys(this.data?.elementData).length > 1) {
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
    }
  }

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

  getImage(event) {
    const self = this;
      const files = event.target.files[0];
      if (files) {
        self.element.imageName = files.name;
        // const fileReader = new FileReader();
        // fileReader.readAsDataURL(files);
        // fileReader.addEventListener("load", function () {
        //   const img: any = this.result;
        //   self.element.image = img;
        //   // self.data.elementData.image = img;
        //   self.save();
        // });
        const formData = new FormData();
        formData.append('media', files);
        this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
          self.element.image = resp.url;
          self.save();
        });    
      }
      // event.target.value = ''
  }

  copyElement() {
    this.element = JSON.parse(JSON.stringify(this.data.elementData));
    this.data.actionType = 'copy';
    this.save()
  }

  save() {
    this.element.insideSection = this.data.elementData.insideSection;
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

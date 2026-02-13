import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @Output() action = new EventEmitter();

  element: any = {
    height: 100,
    width: 100,
    transparency: 100,
    logo: environment.domain + 'assets/img/logo-ch-1.svg',
    logos: [
      {
        name: environment.domain + 'assets/img/logo-ch-1.svg',
        selected: true
      },
      {
        name: environment.domain + 'assets/img/logo-ch-2.svg',
        selected: false
      },
      {
        name: environment.domain + 'assets/img/logo-ch-3.svg',
        selected: false
      }
    ]
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
  
  copyElement() {
    this.data.actionType = 'copy';
    this.action.emit(this.data);
  }

  selectLogo(selLogo) {
    this.element.logo = selLogo.name;
    this.element.logos.forEach(logo => {
      if (logo.name === selLogo.name) {
        logo.selected = true;
      } else {
        logo.selected = false;
      }
    }); 
  }

  getImage(event) {
    const self = this;
      const files = event.target.files[0];
      if (files) {
        // const fileReader = new FileReader();
        // fileReader.readAsDataURL(files);
        // fileReader.addEventListener("load", function () {
        //   const customLogo = {name: this.result, selected: false};
        //   self.element.logos.push(customLogo);
        //   self.selectLogo(customLogo);
        // });    
        const formData = new FormData();
        formData.append('media', files);
        this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
          const customLogo = {name: resp.url, selected: false};
          self.element.logos.push(customLogo);
          self.selectLogo(customLogo);
        });    
      }
      // event.target.value = ''
  }

  save() {
    this.element.insideSection = this.data.elementData.insideSection;
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

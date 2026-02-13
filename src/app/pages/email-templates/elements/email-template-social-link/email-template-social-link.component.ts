import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-email-template-social-link',
  templateUrl: './email-template-social-link.component.html',
  styleUrls: ['./email-template-social-link.component.scss']
})
export class EmailTemplateSocialLinkComponent implements OnInit {
  @Input() data: any;
  selected = false;
  @Output() action = new EventEmitter();
  selectedLogo = {
    name: 'Instagram',
    logo: environment.domain + 'assets/img/insta.svg',
    link: '',
    selected: true
  };
  element: any = {
    manageLinks: {
      logos: [
        {
          name: 'Instagram',
          logo: environment.domain + 'assets/img/insta.svg',
          link: '',
          selected: true
        },
        {
          name: 'Whatsapp',
          logo: environment.domain + 'assets/img/whatsapp.svg',
          link: '',
          selected: false
        },
        {
          name: 'Facebook',
          logo: environment.domain + 'assets/img/fb.svg',
          link: '',
          selected: false
        },
        {
          name: 'Linkedin',
          logo: environment.domain + 'assets/img/linkedin.svg',
          link: '',
          selected: false
        },
        {
          name: 'Youtube',
          logo: environment.domain + 'assets/img/youtube.svg',
          link: '',
          selected: false
        }
      ]
    },
    socialBar: {
      direction: 'horizontal',
      spacing: 24,
      iconSize: 60,
      showText: false,
      textSize: 20
    }
  }

  constructor() { }

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

  selectLogo(logo) {
    this.selectedLogo = logo;
    this.element.manageLinks.logos.forEach(logo => {
      if (logo.name === this.selectedLogo.name) {
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
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
          const customLogo = {name: files.name, logo: this.result, selected: false, link: ''};
          self.element.manageLinks.logos.push(customLogo);
          self.selectLogo(customLogo);
        });    
      }
      // event.target.value = ''
  }

  removeIcon(index) {
    this.element.manageLinks.logos.splice(index, 1);
  }

  save() {
    this.element.socialBar.textSize = this.element.socialBar.textSize;
    this.element.socialBar.iconSize = this.element.socialBar.iconSize;
    this.element.socialBar.spacing = this.element.socialBar.spacing;
    this.element.insideSection = this.data.elementData.insideSection;
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

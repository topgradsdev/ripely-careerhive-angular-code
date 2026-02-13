import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import { TopgradserviceService } from '../../../../topgradservice.service';
// Add custom icon
const icons = Quill.import('ui/icons');
icons['custom-icon'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M12 2L2 7v6c0 6 4.2 10.8 10 11 5.8-.2 10-5 10-11V7l-10-5z"/></svg>';


@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() data: any;
  @ViewChild('placeholderModel') placeholderModel: ModalDirective;
  
  selected = false;
  text = "";
  @Output() action = new EventEmitter();
  element: any = {
    size: 16,
    bold: false,
    italic: false,
    underline: false,
    fontFamily: 'Arial',
    color: '#23282c',
    textAlign: 'left',
    value: ''
  }


  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
        ['link']  ,
        ['custom-button']  // Custom button added to toolbar
      ],
      handlers: {
        'custom-button': () => this.insertCustomElement()  // Custom button click handler
      }
    }
    // toolbar: [
    //   ['bold', 'italic', 'underline', 'strike'],        
    //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
    //   ['link']  ,
    //   ['placeholder']   
    // ]
  };
  constructor(private Service: TopgradserviceService, private cdr: ChangeDetectorRef) { }

  editorContent = '';  // Stores editor content
  editor:Quill;

  onEditorCreated(quill: Quill) {
    this.editor = quill;
    this.editor.focus()
  }

  selectedKey:any = '';
  selectedType:any = '';
 @ViewChild('searchpInput') searchpInput: ElementRef;
  chooseValue(){
    // const range = this.editor.getSelection(true);  
    // if (range) {
    //   // const elementHtml = '<button class="custom-btn" (click)="handleClick()">Click me</button>';
    //   this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
      
    // }
    if (this.editor) {
      const range = this.editor.getSelection(true);  // Get the current cursor position
  
      if (range) {
          // this.editor.clipboard.dangerouslyPasteHTML(range.index, `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`);
          // Prepare the placeholder text to be inserted
          const placeholderText = `&nbsp;{{${this.selectedType} : ${this.selectedItem}}}&nbsp;`;
  
          // Insert the placeholder text at the current cursor position
          this.editor.clipboard.dangerouslyPasteHTML(range.index, placeholderText);
  
          // Compute the new cursor position
          const newIndex = range.index + placeholderText.length - 10;
  
          // Move the cursor to the end of the inserted placeholder text with a slight delay
          setTimeout(() => {
              console.log("Setting cursor position to:", newIndex);
              this.editor.setSelection(newIndex, 0);
              this.editor.focus();  // Ensure focus remains in the editor
          }, 10); // Delay ensures Quill processes the update
      } else {
          console.log("No valid selection found in the editor");
      }
  }
    setTimeout(() => {
      if (this.selectedType) {
        this.getKey();
      }
    }, 200);
    this.placeholderModel.hide();
    // this.selectedType = '';
    this.selectedItem = '';
    this.selectedKey = '';
    // this.placeholderList = [];
    // this.filteredplaceholderList = [];
    // this.copyPlacementTypes();
  }

  //open model
  insertCustomElement() {
    // this.selectedType = '';
    this.selectedItem = '';
    this.selectedKey = '';
    // this.placeholderList = [];
    // this.copyPlacementTypes();
 
    this.placeholderModel.show();
    setTimeout(() => {
      this.cdr.detectChanges(); 
      if (this.searchpInput) {
        this.searchpInput.nativeElement.focus();
      }
    }, 300); 
  }

  search(){

  }

  applyFilter(filterValue) {

    this.selectedKey = filterValue.target.value
    this.filteredplaceholderList = this.placeholderList.filter(item => {
      return item.title?.toString().toLowerCase().includes(this.selectedKey.toLowerCase());
    });

  }
  filteredplaceholderList:any = [];
  copyPlacementTypes(){
    this.filteredplaceholderList = this.placeholderList;
    // console.log("this.allPlacementTypes", this.filteredplaceholderList);
  }



  selectedItem:any = '';
  placeholderList:any = [];
  ngOnInit(): void {
    if (Object.keys(this.data?.elementData).length > 1) {
      this.text = JSON.parse(JSON.stringify(this.data.elementData.value));
      this.element = JSON.parse(JSON.stringify(this.data.elementData));
    }
  }

  getKey(){
    this.placeholderList = [];
    this.copyPlacementTypes();
    var obj = {
      type: this.selectedType.toLowerCase()
    }
    this.Service.getEmailTemplateKey(obj).subscribe(res => {
      // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
      if (res.status == 200) {
        this.placeholderList = res.db_fields;
        this.copyPlacementTypes();
      } else {
        this.placeholderList = [];
      }
     
    }, err => {
      this.Service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }

  toggleElement() {
    if (this.data.elementData.insideSection) {
      return;
    }
    this.selected = !this.selected;
  }

  changeText() {
    this.element.value = this.text;
    this.save();
  }

  onContentChanged = (event) =>{
    if (event.html) {
      this.element.value = event.html;
    this.save();
    }
  }

  deleteElement() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  copyElement() {
    this.element = JSON.parse(JSON.stringify(this.data.elementData));
    this.data.actionType = 'copy';
    this.save();
  }

  save() {
    this.element.insideSection = this.data.elementData.insideSection;
    this.data.elementData = this.element;
    this.action.emit(this.data);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { FileIconService } from 'src/app/shared/file-icon.service';

@Component({
  selector: 'app-downloadable-content',
  templateUrl: './downloadable-content.component.html',
  styleUrls: ['./downloadable-content.component.scss']
})
export class DownloadableContentComponent implements OnInit {
  @Input() data: any;
  @Output() action = new EventEmitter();
  textElementForm: FormGroup;
  extenstionList = [
    { id: 'word', name: 'Word Document (.docx, .doc)' },
    { id: 'excel', name: 'Excel (.xlsx, .csv, .xls)' },
    { id: 'pdf', name: 'PDF Document (.pdf)' }
  ];
  isAdvanced = false;
  permissions = {
    student: {
      read: true,
      write: true
    },
    employee: {
      read: true,
      write: true
    },
    staff: {
      read: true,
      write: true
    }
  };

  constructor(private fb: FormBuilder, private service: TopgradserviceService, private fileIconService: FileIconService) { }
  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
  }
  
  ngOnInit(): void {
    this.textElementForm = this.fb.group({
      title: [this.data.name],
      type: ['downloadable'],
      description: ['Click the Pencil Icon to add Downloadable Content for the form recipients to download'],
      value: [''],
      extenstions: ['Word Document (.docx, .doc)'],
      size: [5],
      selection_type: ['single'],
      required: [false]
    });
    if (Object.keys(this.data.elementData).length > 0) {
      this.textElementForm.patchValue({
        title: this.data.name,
        type: 'downloadable',
        description: this.data.elementData.description,
        value: this.data.elementData.value,
        extenstions: this.data.elementData.extenstions,
        size: this.data.elementData.size,
        selection_type: this.data.elementData.selection_type,
      });
    }
    if (!this.data.elementData.description) {
      this.data.elementData.description = this.textElementForm.value.description;
    }
    // if (this.data.elementData.permissions) {
    //   this.permissions = this.data.elementData.permissions;
    // }
    // if (!this.data.elementData.permissions){
    //   this.data.elementData.permissions = this.permissions;
    // }
  }
  
  updateFormValue() {
    this.textElementForm.patchValue({
      value: this.data.elementData.value
    });
  }
  
  deleteElement() {
    this.data.actionType = 'delete';
    this.action.emit(this.data);
  }

  toggleElementSize() {
    this.data.isElementWidthFull = !this.data.isElementWidthFull;
    this.action.emit(this.data);
  }

  submit() {
    this.data.actionType = 'submit';
    this.data.name = this.textElementForm.value.title;
    this.data.elementData = this.textElementForm.value;
    this.data.elementData.permissions = this.permissions;
    this.action.emit(this.data);
  }

  addPermission(type, user) {
    if (type === 'write' && this.permissions[user].write) {
      this.permissions[user].read = true;
    } else if (type === 'read' && !this.permissions[user].read) {
      this.permissions[user].write = false;
    }
  }

  // uploadFile(event, field) {
  //   if (event.target.files[0].size > 5 * 1048576) {
  //     this.service.showMessage({
  //       message: 'Please select file less than 5MB'
  //     });
  //     return;
  //   }
  //   event.target.files.forEach(file => {
  //     const formData = new FormData();
  //     formData.append('media', file);
  //     this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
  //       const files = this.textElementForm.value.value?.length > 0 ? this.textElementForm.value.value : [];
  //       files.push(resp);
  //       this.textElementForm.patchValue({
  //         value: files
  //       });
  //     });
  //   });
  //   event.target.value = "";
  // }
  uploadFile(event: any, field: any) {
    const files: FileList = event.target.files;

    // Check the first file size (or loop later if multiple)
    if (files[0].size > 5 * 1048576) {
      this.service.showMessage({
        message: 'Please select file less than 5MB'
      });
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('media', file);

      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        const currentFiles = this.textElementForm.value.value?.length > 0
          ? this.textElementForm.value.value
          : [];
        currentFiles.push(resp);

        this.textElementForm.patchValue({
          value: currentFiles
        });
      });
    });

    // Reset file input so same file can be re-uploaded if needed
    event.target.value = '';
  }


  deleteFile(index) {
    this.textElementForm.controls['value'].value.splice(index, 1);
  }

  downloadFile(url: string) {
    window.open(url);
  }

  async downloadPDF(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('There was an error downloading the PDF:', error);
      this.downloadFile(url);
    }
  }

  async viewPDF(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      window.open(blobURL, '_blank');
      window.URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('There was an error viewing the PDF:', error);
      this.downloadFile(url);
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FileIconService } from 'src/app/shared/file-icon.service';

@Component({
  selector: 'app-preview-multi-form',
  templateUrl: './preview-multi-form.component.html',
  styleUrls: ['./preview-multi-form.component.scss']
})
export class PreviewMultiFormComponent implements OnInit {
  @Input() multiStepFormPreviewData: any;
  constructor(private fileIconService: FileIconService) { }

  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
  }
  ngOnInit(): void {
    console.log("multiStepFormPreviewDatamultiStepFormPreviewData", this.multiStepFormPreviewData);
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

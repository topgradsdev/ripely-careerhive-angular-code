import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpResponseCode} from '../../enum';
import { ModalDirective } from 'ngx-bootstrap/modal';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-view-email-popup',
  templateUrl: './view-email-popup.component.html',
  styleUrls: ['./view-email-popup.component.scss']
})
export class ViewEmailPopupComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };

  example: string = `<div>this is another div <br/> i want to insert dynamically</div>`

  @Input() modalId: string;
  @Input() data:any;
  constructor(private service: TopgradserviceService, private fb: FormBuilder, 
    private sanitizer: DomSanitizer, private el: ElementRef) { }

  ngOnInit(): void {
   
  }
  sanitizedEmailBody: SafeHtml = '';
  // ngOnChanges() {
  //   console.log("this.data", this.data);
  //   if (this.data?.email_body) {
  //     this.sanitizedEmailBody = this.sanitizer.bypassSecurityTrustHtml(this.data.email_body);
  //   }
  // }
  ngOnChanges() {
  console.log("this.data", this.data);
  if (this.data?.email_body) {
    // Preprocess: replace fixed width inline styles with responsive styles
    let htmlString = this.data.email_body;

    // Replace width:1200px with responsive
    htmlString = htmlString.replace(/width\s*:\s*1200px\s*;?/gi, 'width:100%; height:auto;');
    htmlString = htmlString.replace(/width\s*:\s*40px\s*;?/gi, 'width:47px; height:47px');

    // Optional: remove all hardcoded width/height styles on <img>
    // htmlString = htmlString.replace(/(width\s*:\s*\d+px\s*;?)/gi, 'width:100%;')
    //                        .replace(/(height\s*:\s*\d+px\s*;?)/gi, 'height:auto;');

    // Sanitize after processing
    this.sanitizedEmailBody = this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
}

  ngAfterViewInit() {
    // Attach event listener after the view initializes
    this.el.nativeElement.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A') {
        event.preventDefault(); // Prevent default Angular behavior
        const url = target.getAttribute('href');
        if (url) {
          window.open(url, '_blank'); // Open link in new tab
        }
      }
    });
  }
  generatePDFForm(): void {
    const element = document.getElementById('donwloadFormHtmlEmail');
    console.log('Element to capture:', element); // Debugging line

    if (element) {
        const downloadButton = document.getElementById('pdfHide') as HTMLElement;
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }

        // Remove all <img> tags from the element
        const imgs = element.getElementsByTagName('img');
        while (imgs.length > 0) {
            imgs[0].parentNode.removeChild(imgs[0]);
        }

        // Generate PNG from the modified HTML element
        domtoimage.toPng(element)
            .then((dataUrl) => {
                console.log('Generated Data URL:', dataUrl); // Debugging line

                const pdf = new jsPDF('p', 'mm', 'a4');

                // Create a new image element
                const img = new Image();
                img.src = dataUrl;

                img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    const imgWidth = 210; // A4 width in mm
                    let imgHeight = imgWidth / aspectRatio;

                    if (imgHeight > 297) { // A4 height in mm
                        let positionY = 0;
                        const totalPages = Math.ceil(imgHeight / 297);

                        for (let i = 0; i < totalPages; i++) {
                            if (i > 0) pdf.addPage();
                            const heightForPage = Math.min(297, imgHeight - positionY);
                            pdf.addImage(dataUrl, 'PNG', 0, positionY * -1, imgWidth, heightForPage);
                            positionY += heightForPage;
                        }
                    } else {
                        pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
                    }

                    // Save the PDF
                    pdf.save('generated.pdf');

                    // Show download button again
                    if (downloadButton) {
                        downloadButton.style.display = 'block';
                    }
                };

                img.onerror = (error) => {
                    console.error('Error loading image:', error);
                };
            })
            .catch((error) => {
                console.error('Error capturing HTML:', error);
                if (downloadButton) {
                    downloadButton.style.display = 'block';
                }
            });
    } else {
        console.error('No content found to generate PDF');
    }
}

  
}

import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-under-maintenance',
  templateUrl: './under-maintenance.component.html',
  styleUrls: ['./under-maintenance.component.scss']
})
export class UnderMaintenanceComponent implements OnInit {
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
  @Input() data:any = {};
  constructor(private service: TopgradserviceService, private fb: FormBuilder, 
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
    this.data.email_body = this.sanitizer.bypassSecurityTrustHtml(this.data.email_body);
  }


  generatePDFForm(): void {
    const element = document.getElementById('donwloadFormHtmlEmail');
    
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

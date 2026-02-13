import { Component, Input, OnInit } from '@angular/core';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { FileIconService } from '../../file-icon.service';
import { TopgradserviceService } from 'src/app/topgradservice.service';
@Component({
  selector: 'app-preview-forms',
  templateUrl: './preview-forms.component.html',
  styleUrls: ['./preview-forms.component.scss']
})
export class PreviewFormsComponent implements OnInit {
  @Input() selectedTask: any;
  @Input() type: any;
  vertical:boolean = false;
  
  constructor(private fileIconService: FileIconService, private service: TopgradserviceService) { }


  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }


  ngOnInit(): void {
    console.log("selectedTaskselectedTaskselectedTask", this.selectedTask);
    const loader = document.getElementById('loader'); // Loader element
    if (loader) loader.style.display = 'none';
    if(this.selectedTask.form_fields?.type == "multi_step"){
      // if(this.selectedTask.form_id == "66e90e667f5977ef63ac838e"){
      //   this.selectedTask?.form_fields?.fields.pop();
      // }
      this.selectedTask?.form_fields?.fields.map(el=>{
        el.component.map(e=>{
          if(e.id=="single" || e.id=="multi"){
            // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
            e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
            ? e.elementData.value.replace(/�/g, '') 
            : e.elementData.value;
       
          }
          if(e.id=="yes_no"){
            if(e.elementData.value==true){
              e.elementData.value = 'Yes';
            }else{
              e.elementData.value = 'No';
            }
        }
        })
      })
    }else{
      this.selectedTask?.form_fields?.fields.map(e=>{
          if(e.id=="single" || e.id=="multi"){
            // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
            e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
            ? e.elementData.value.replace(/�/g, '') 
            : e.elementData.value;
       
          }
          if(e.id=="yes_no"){
            if(e.elementData.value==true){
              e.elementData.value = 'Yes';
            }else{
              e.elementData.value = 'No';
            }
        }
    })
    }
   
  }

  ngOnChanges(): void {
     
      const loader = document.getElementById('loader'); // Loader element
      if (loader) loader.style.display = 'none';
      if(this.selectedTask.form_fields?.type == "multi_step"){
      
        this.selectedTask?.form_fields?.fields.map(el=>{
          el.component.map(e=>{
            if(e.id=="single" || e.id=="multi"){
              // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
              e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
              ? e.elementData.value.replace(/�/g, '') 
              : e.elementData.value;
       
            }
          })
        })
      }else{
        this.selectedTask?.form_fields?.fields.map(e=>{
            if(e.id=="single" || e.id=="multi"){
              // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
              e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
              ? e.elementData.value.replace(/�/g, '') 
              : e.elementData.value;
       
            }
      })
      this.vertical = false;
    }
   

    console.log("selectedTaskselectedTaskselectedTask", this.selectedTask);
  }

  ngAfterViewInit(): void {
    const loader = document.getElementById('loader'); // Loader element
    if (loader) loader.style.display = 'none';
    const submitButtons = document.querySelectorAll('#pdfHide') as NodeListOf<HTMLElement>;
      console.log("submitButtons", submitButtons);
    submitButtons.forEach(button => {
      console.log("button", button);
      button.style.display = 'none';
    });
  }


getValueInsideSingleBracket(input: unknown): string[] {
    try {
      if (!input) {
        return [];
      }

      let text = '';

      if (Array.isArray(input)) {
        text = input.join(' ');
      } else if (typeof input === 'string') {
        text = input;
      } else {
        console.warn('Invalid input type:', input);
        return [];
      }

      const regex = /\(([^)]+)\)/g;
      const matches = [...text.matchAll(regex)];

      return matches.map(match => match[1]);
    } catch (error) {
      console.error('getValueInsideSingleBracket error:', error);
      return [];
    }
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

generatePDFForm1() {
  const loader = document.getElementById('loader'); // Loader element
  setTimeout(() => {
    const element = document.getElementById('donwloadFormHtml');
    console.log('Element to capture:', element); // Debugging line

    if (element) {
      const downloadButton = document.getElementById('pdfHide') as HTMLElement;
      if (downloadButton) {
        downloadButton.style.display = 'none';
      }
      domtoimage.toPng(element)
        .then((dataUrl) => {
          console.log('Generated Data URL:', dataUrl); // Debugging line
          if (loader) loader.style.display = 'block';

          const pdf = new jsPDF('p', 'mm', 'a4');
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm

            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate aspect ratio
            const aspectRatio = imgWidth / imgHeight;

            const pdfImgWidth = pageWidth; // PDF's image width
            const pdfImgHeight = pdfImgWidth / aspectRatio;

            if (pdfImgHeight > pageHeight) {
              // Content exceeds single page; split into multiple pages
              let positionY = 0;
              let remainingHeight = pdfImgHeight;

              while (remainingHeight > 0) {
                pdf.addImage(
                  dataUrl,
                  'PNG',
                  0,
                  0, // X and Y position on page
                  pdfImgWidth,
                  Math.min(remainingHeight, pageHeight) // Adjust height for current page
                );

                remainingHeight -= pageHeight; // Decrease the remaining height
                positionY += pageHeight;

                if (remainingHeight > 0) {
                  pdf.addPage();
                }
              }
            } else {
              // Content fits on a single page
              pdf.addImage(dataUrl, 'PNG', 0, 0, pdfImgWidth, pdfImgHeight);
            }

            // pdf.save('generated.pdf');
            const fileName = `${
              this.selectedTask?.formDetails?.title || 
              this.selectedTask?.form_title || 
              'Form'
            }_${
              this.selectedTask?.student_name || 
              this.selectedTask?.StudentCode || 
              'Unknown'
            }.pdf`;
            
            pdf.save(fileName);
            if (downloadButton) {
              downloadButton.style.display = 'block';
            }
          };

          img.onerror = (error) => {
            console.error('Error loading image:', error);
          };

          if (loader) loader.style.display = 'none';
          this.vertical=false;
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
  }, 500);
}

async generatePDFForm(): Promise<void> {
  const loader = document.getElementById('loader'); // Loader element
  
  setTimeout(async () => {
    const element = document.getElementById('donwloadFormHtmlMulti');
    if (!element) {
      console.error('Element not found!');
      return;
    }

    // Show the loader
    if (loader) loader.style.display = 'block';

    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    try {
      // Convert the element to an image
      const canvas = await domtoimage.toPng(element, { quality: 1 });
      const img = new Image();
      img.src = canvas;

      img.onload = () => {
        const imgWidth = pdfWidth;
        const imgHeight = (img.height * imgWidth) / img.width;

        let position = 0;
        let currentHeight = imgHeight;

        // Add the first page
        pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
        currentHeight -= pdfHeight;

        // Add more pages if needed
        while (currentHeight > 0) {
          position -= pdfHeight; // Move to the next page
          pdf.addPage();
          pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
          currentHeight -= pdfHeight;
        }

        // Save the PDF
        const fileName = `${
          this.selectedTask?.formDetails?.title || 
          this.selectedTask?.form_title || 
          'Form'
        }_${
          this.selectedTask?.student_name || 
          this.selectedTask?.StudentCode || 
          'Unknown'
        }.pdf`;
        
        pdf.save(fileName);

        // pdf.save(`${this.selectedTask?.formDetails?.title}_${this.selectedTask?.student_id}.pdf`);

        // Hide the loader after saving
        if (loader) loader.style.display = 'none';
        this.vertical=false;
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (loader) loader.style.display = 'none'; // Ensure the loader hides on error
    }
  }, 500);
}

checkFieldPermission(permissions) {
  if(this.type=="company"){
    // if (this.selectedTask?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return 'editable';
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    // }
  }else{
    // if (this.selectedTask?.staff_status !== 'completed') {
      if (permissions?.student.write && permissions?.student.read) {
        return 'editable';
      } else if (!permissions?.student.write && permissions?.student.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    // }
  }

}


getFullHTML(element: HTMLElement): string {
  // Clone so original DOM is not modified
  const clonedEl = element.cloneNode(true) as HTMLElement;

  // Query both original and cloned nodes in parallel so we can copy runtime properties
  const origNodes = element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLElement>(
    "input, textarea, select, [contenteditable]"
  );
  const cloneNodes = clonedEl.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLElement
  >("input, textarea, select, [contenteditable]");

  // Safety: counts should match when cloning a subtree; if not, we'll still iterate min length.
  const len = Math.min(origNodes.length, cloneNodes.length);

  for (let i = 0; i < len; i++) {
    const orig = origNodes[i];
    const clone = cloneNodes[i];

    // Handle inputs
    if (orig instanceof HTMLInputElement && clone instanceof HTMLInputElement) {
      const type = (orig.type || "").toLowerCase();

      if (type === "checkbox" || type === "radio") {
        // Copy checked state as an attribute
        if (orig.checked) {
          clone.setAttribute("checked", "checked");
        } else {
          clone.removeAttribute("checked");
        }

        // Also copy value attribute (if any)
        if (orig.hasAttribute("value") || orig.value !== "") {
          clone.setAttribute("value", orig.value);
        } else {
          // ensure no stale value attribute remains
          clone.removeAttribute("value");
        }
      } else if (type === "file") {
        // Do not try to serialize file inputs (privacy/security)
        clone.removeAttribute("value");
      } else {
        // Standard inputs including date, time, datetime-local, number, text, etc.
        // Copy current value into attribute so innerHTML contains it.
        if (orig.value !== "") {
          clone.setAttribute("value", orig.value);
        } else {
          clone.removeAttribute("value");
        }
      }

      // If input has placeholder you may want to preserve it (optional)
      if (orig.placeholder) clone.setAttribute("placeholder", orig.placeholder);

      continue;
    }

    // Handle textarea
    if (orig instanceof HTMLTextAreaElement && clone instanceof HTMLTextAreaElement) {
      // Set text content to the current value (keeps newlines)
      clone.textContent = orig.value;
      continue;
    }

    // Handle select (single and multiple)
    if (orig instanceof HTMLSelectElement && clone instanceof HTMLSelectElement) {
      const origOptions = Array.from(orig.options);
      const cloneOptions = Array.from(clone.options);

      // Iterate options and set/remove selected attribute based on runtime selected state
      for (let j = 0; j < Math.min(origOptions.length, cloneOptions.length); j++) {
        const oOpt = origOptions[j];
        const cOpt = cloneOptions[j];
        if (oOpt.selected) {
          cOpt.setAttribute("selected", "selected");
        } else {
          cOpt.removeAttribute("selected");
        }
      }
      continue;
    }

    // Handle contenteditable elements (copy innerHTML)
    // Note: orig might be a generic HTMLElement matched by [contenteditable]
    if ((orig as HTMLElement).isContentEditable && (clone as HTMLElement).isContentEditable) {
      (clone as HTMLElement).innerHTML = (orig as HTMLElement).innerHTML;
      continue;
    }
  }

  // Build final HTML string
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
<style>
  * {
    font-family: var(--font-primary), 'DM Sans', sans-serif !important;
    letter-spacing: normal !important;
    font-weight: 400 !important;
  }

  input, textarea, select, button {
    font-family: inherit !important;
  }
</style>
</head>
<body>
  ${clonedEl.innerHTML}
</body>
</html>
  `.trim();
}

getDateOnly(value: string) {
  return value ? value.substring(0, 10) : '';
}

  downloadPDFHcaaf(){
    setTimeout(()=>{
       const element =this.selectedTask?.form_fields?.type === 'multi_step'? document.getElementById('pdfContentM'): document.getElementById('pdfContent');

        if (!element) return;

        // Get HTML with inline CSS
        const htmlWithCss = this.getFullHTML(element);
        console.log("htmlWithCss", htmlWithCss)

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        const fileName = `${
          (this.selectedTask?.formDetails?.title || this.selectedTask?.form_title) + '_' + new Date().getTime() + '_' +
          formattedDate
        }`;
        let payload = {
          html: htmlWithCss,
          filename: fileName,
          _id: this.selectedTask._id,
        };

        console.log("payload", payload);

      // console.log("payload", payload);
      // return false;
        this.service.downloadPDFHcaafForm(payload).subscribe((pdfBlob: Blob) => {
            this.vertical = false;
            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;   // downloaded file name
            a.click();

            // Cleanup
            URL.revokeObjectURL(url);
          }, err => {
            this.service.showMessage({
              message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
            });
          })
    }, 600)
      
  }
  


checkDropDownFieldPermission(permissions) {
  if (this.selectedTask?.staff_status !== 'completed') {
    if (permissions?.staff.write && permissions?.staff.read) {
      return false;
    } else if (!permissions?.staff.write && permissions?.staff.read) {
      return true;
    } else {
      return true;
    }
  }
}
}

// import {
//   Directive,
//   ElementRef,
//   HostListener,
//   AfterViewInit,
//   Renderer2,
// } from '@angular/core';

// @Directive({
//   selector: 'textarea[autoResize]',
// })
// export class AutoResizeDirective implements AfterViewInit {
//   constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

//   ngAfterViewInit() {
//     // Ensure styles are applied after the view is initialized
//     setTimeout(() => {
//       this.resizeTextArea();
//     });
//   }

//   @HostListener('input') onInput(): void {
//     this.resizeTextArea();
//   }
//   private resizeTextArea(): void {
//     const textarea: HTMLTextAreaElement = this.elementRef.nativeElement;
  
//     // Ensure height is reset before calculating
//     textarea.style.height = 'auto';
  

//     console.log("textarea.offsetWidth", textarea.offsetWidth);
//     // Calculate estimated height
//     const contentLength = textarea.value.length;
//     const lineHeight = 20; // Set the line height (in pixels) based on your styling
//     const charsPerLine = 30; // Approximate characters that fit in one line
//     const padding = 10; // Add extra padding if required
//     const minHeight = 50; // Minimum height in pixels
  
//     // Calculate number of lines
//     const numLines = Math.ceil(contentLength / charsPerLine);
  
//     console.log("numLines", numLines);
//     // Calculate estimated height
//     const estimatedHeight = numLines * lineHeight + padding;
  
//     // Apply calculated height, ensuring it doesn't go below the minimum height
//     textarea.style.height = `${Math.max(estimatedHeight, minHeight)}px`;
  
//     // Debugging: Log the calculated values
//     console.log('Content length:', contentLength);
//     console.log('Estimated height:', estimatedHeight);
//   }
  
// }


import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]' // Apply this directive to a textarea
})
export class AutoResizeDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Initial resize after view is initialized
    this.resizeTextArea();
  }

  // Listen for input events to adjust height dynamically
  @HostListener('input')
  onInput(): void {
    this.resizeTextArea();
  }

  // Optional: Listen for window resize events to adapt to screen size changes
  @HostListener('window:resize')
  onResize(): void {
    this.resizeTextArea();
  }

  private resizeTextArea(): void {
        const textarea: HTMLTextAreaElement = this.elementRef.nativeElement;
      
        // Ensure height is reset before calculating
        textarea.style.height = 'auto';
      
    
        // console.log("textarea.offsetWidth", textarea.offsetWidth);
        // Calculate estimated height
        const contentLength = textarea.value.length;
        const lineHeight = 20; // Set the line height (in pixels) based on your styling
        let charsPerLine = 30; // Approximate characters that fit in one line
        const padding = 10; // Add extra padding if required
        const minHeight = 50; // Minimum height in pixels
      
        const screenWidth = window.innerWidth;
        // console.log("screenWidth", screenWidth);
        if(screenWidth >=320){
          charsPerLine = 5
        }else  if(screenWidth <=320 && screenWidth <=480 ){
          charsPerLine = 10
        }
        // Calculate number of lines
        const numLines = Math.ceil(contentLength / charsPerLine);
      
        // console.log("numLines", numLines);
        // Calculate estimated height
        const estimatedHeight = numLines * lineHeight + padding;
      
        // Apply calculated height, ensuring it doesn't go below the minimum height

        
        // textarea.style.height = `${Math.max(estimatedHeight, minHeight)}px`;
      
        // Debugging: Log the calculated values
        // console.log('Content length:', contentLength);
        // console.log('Estimated height:', estimatedHeight);
      }
  
    

  // private resizeTextArea(): void {
  //   const textarea: HTMLTextAreaElement = this.elementRef.nativeElement;

  //   // Reset height to 'auto' to ensure accurate scrollHeight measurement
  //   this.renderer.setStyle(textarea, 'height', 'auto');

  //   // Get the width of the textarea
  //   const textareaWidth = textarea.offsetWidth || 1; // Fallback to 1 to prevent division by zero

  //   // Dynamically adjust avgCharWidth and lineHeight based on screen size
  //   let avgCharWidth = 8; // Average character width in pixels
  //   let lineHeight = 20;  // Line height in pixels

  //   const screenWidth = window.innerWidth; // Get current screen width

  //   if (screenWidth <= 480) {
  //     // Mobile
  //     avgCharWidth = 6;
  //     lineHeight = 18;
  //   } else if (screenWidth <= 768) {
  //     // Tablet
  //     avgCharWidth = 7;
  //     lineHeight = 20;
  //   } else {
  //     // Desktop
  //     avgCharWidth = 12;
  //     lineHeight = 22;
  //   }

  //   // Calculate the number of characters that fit per line
  //   const charsPerLine = Math.floor(textareaWidth / avgCharWidth);

  //   // Ensure charsPerLine has a safe minimum value
  //   const safeCharsPerLine = Math.max(charsPerLine, 10); // Minimum 10 chars per line

  //   // Calculate the height based on content length
  //   const contentLength = textarea.value.length;
  //   const numLines = Math.ceil(contentLength / safeCharsPerLine);
  //   const padding = 10; // Add extra padding if needed
  //   const minHeight = 50; // Minimum height in pixels

  //   // Calculate the estimated height
  //   const estimatedHeight = numLines * lineHeight + padding;

  //   // Apply the calculated height
  //   this.renderer.setStyle(textarea, 'height', `${Math.max(estimatedHeight, minHeight)}px`);

  //   // Debugging: Log values for verification
  //   console.log('Screen width:', screenWidth);
  //   console.log('Textarea width:', textareaWidth);
  //   console.log('Avg char width:', avgCharWidth);
  //   console.log('Line height:', lineHeight);
  //   console.log('Chars per line:', safeCharsPerLine);
  //   console.log('Content length:', contentLength);
  //   console.log('Estimated height:', estimatedHeight);
  // }
}

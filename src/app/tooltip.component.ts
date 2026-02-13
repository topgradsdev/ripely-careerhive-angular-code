import {
    Directive,
    ElementRef,
    Input,
    Renderer2,
    HostListener,
    ComponentRef,
    ComponentFactoryResolver,
    ViewContainerRef,
  } from '@angular/core';
  import { Component } from '@angular/core';
  
  @Directive({
    selector: '[htmlTooltip]',
  })
  export class HtmlTooltipDirective {
    @Input('htmlTooltip') htmlContent: string = '';
    private tooltipElement: HTMLElement | null = null;
  
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    @HostListener('mouseenter')
    onMouseEnter(): void {
      if (!this.tooltipElement) {
        this.createTooltip();
      }
    }
  
    @HostListener('mouseleave')
    onMouseLeave(): void {
      this.destroyTooltip();
    }
  
    private createTooltip(): void {
      this.tooltipElement = this.renderer.createElement('div');
      this.renderer.setProperty(this.tooltipElement, 'innerHTML', this.htmlContent);
  
      this.renderer.appendChild(document.body, this.tooltipElement);
      this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
      this.renderer.setStyle(this.tooltipElement, 'top', `${this.el.nativeElement.getBoundingClientRect().top - 10}px`);
      this.renderer.setStyle(this.tooltipElement, 'left', `${this.el.nativeElement.getBoundingClientRect().left + 10}px`);
      this.renderer.setStyle(this.tooltipElement, 'background', '#fff');
      this.renderer.setStyle(this.tooltipElement, 'border', '1px solid #ccc');
      this.renderer.setStyle(this.tooltipElement, 'padding', '8px');
      this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0px 2px 10px rgba(0,0,0,0.2)');
      this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    }
  
    private destroyTooltip(): void {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
    }
  }
  
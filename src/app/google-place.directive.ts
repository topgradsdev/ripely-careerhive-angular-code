import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
declare var google: any;

@Directive({
  selector: '[googlePlace]',
})
export class GooglePlaceDirective implements OnInit {
  @Output() onAddressChange = new EventEmitter<google.maps.places.PlaceResult>();

  googlePlaceOptions1 = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    // types: ['(regions)']
    types: ['geocode', 'establishment']
  };

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    const autocomplete = new google.maps.places.Autocomplete(
      this.el.nativeElement as HTMLInputElement,
      this.googlePlaceOptions1
    );

    autocomplete.addListener('place_changed', () => {
      console.log("calling")
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        this.onAddressChange.emit(place);
      });
    });
  }
}

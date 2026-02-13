import { Component } from '@angular/core';
import { LoaderCustomService } from 'src/app/loadercustomservice.service';

@Component({
  selector: 'app-loader-custom',
  templateUrl: './loader-custom.component.html',
  styleUrls: ['./loader-custom.component.scss'],
})
export class LoaderCustomComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private loaderService: LoaderCustomService) {
    this.isLoading$.subscribe((isLoading) => {
      // console.log('Loader state:', isLoading);
    });
    
  }
}

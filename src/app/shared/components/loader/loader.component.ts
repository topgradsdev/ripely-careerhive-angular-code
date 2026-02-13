import { Component } from '@angular/core';
import { LoaderService } from '../../../loaderservice.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private loaderService: LoaderService) {
    this.isLoading$.subscribe((isLoading) => {
      // console.log('Loader state:', isLoading);
    });
    
  }
}

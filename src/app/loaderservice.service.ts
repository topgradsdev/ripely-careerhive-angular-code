import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false); // Observable for loader state
  public isLoading$ = this.loaderSubject.asObservable(); // Exposed as observable

  // Show loader
  show() {
    // console.log("calling");
    this.loaderSubject.next(true);
  }

  // Hide loader
  hide() {
    //  console.log("hide")
    this.loaderSubject.next(false);
  }
}

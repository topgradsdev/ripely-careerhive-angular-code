import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderCustomService {
  private loaderCustomSubject = new BehaviorSubject<boolean>(false); // Observable for loader state
  public isLoading$ = this.loaderCustomSubject.asObservable(); // Exposed as observable

  // Show loader
  show() {
    // console.log("calling");
    this.loaderCustomSubject.next(true);
  }

  // Hide loader
  hide() {
    //  console.log("hide")
    this.loaderCustomSubject.next(false);
  }
}

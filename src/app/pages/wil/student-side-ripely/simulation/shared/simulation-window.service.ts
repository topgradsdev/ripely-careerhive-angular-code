import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SimulationWindowService {
  private _minimized = new BehaviorSubject<boolean>(false);
  minimized$ = this._minimized.asObservable();

  minimize(): void {
    this._minimized.next(true);
  }

  restore(): void {
    this._minimized.next(false);
  }

  get isMinimized(): boolean {
    return this._minimized.value;
  }
}

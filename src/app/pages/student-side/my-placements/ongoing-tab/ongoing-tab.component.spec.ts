import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTabComponent } from './ongoing-tab.component';

describe('OngoingTabComponent', () => {
  let component: OngoingTabComponent;
  let fixture: ComponentFixture<OngoingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

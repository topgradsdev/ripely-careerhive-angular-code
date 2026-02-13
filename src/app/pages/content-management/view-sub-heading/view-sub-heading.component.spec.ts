import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubHeadingComponent } from './view-sub-heading.component';

describe('ViewSubHeadingComponent', () => {
  let component: ViewSubHeadingComponent;
  let fixture: ComponentFixture<ViewSubHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

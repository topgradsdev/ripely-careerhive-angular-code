import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankSectionComponent } from './blank-section.component';

describe('BlankSectionComponent', () => {
  let component: BlankSectionComponent;
  let fixture: ComponentFixture<BlankSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

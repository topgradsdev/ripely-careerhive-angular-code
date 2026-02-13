import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubHeadingComponent } from './add-sub-heading.component';

describe('AddSubHeadingComponent', () => {
  let component: AddSubHeadingComponent;
  let fixture: ComponentFixture<AddSubHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

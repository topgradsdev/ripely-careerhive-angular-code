import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeadingComponent } from './add-heading.component';

describe('AddHeadingComponent', () => {
  let component: AddHeadingComponent;
  let fixture: ComponentFixture<AddHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

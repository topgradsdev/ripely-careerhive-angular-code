import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubHeadingComponent } from './edit-sub-heading.component';

describe('EditSubHeadingComponent', () => {
  let component: EditSubHeadingComponent;
  let fixture: ComponentFixture<EditSubHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

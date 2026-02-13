import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHeadingComponent } from './edit-heading.component';

describe('EditHeadingComponent', () => {
  let component: EditHeadingComponent;
  let fixture: ComponentFixture<EditHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

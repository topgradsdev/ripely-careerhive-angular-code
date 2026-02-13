import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsFieldComponent } from './attachments-field.component';

describe('AttachmentsFieldComponent', () => {
  let component: AttachmentsFieldComponent;
  let fixture: ComponentFixture<AttachmentsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

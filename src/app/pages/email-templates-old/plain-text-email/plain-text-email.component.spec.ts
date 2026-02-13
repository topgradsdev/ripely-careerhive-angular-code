import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTextEmailComponent } from './plain-text-email.component';

describe('PlainTextEmailComponent', () => {
  let component: PlainTextEmailComponent;
  let fixture: ComponentFixture<PlainTextEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainTextEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTextEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

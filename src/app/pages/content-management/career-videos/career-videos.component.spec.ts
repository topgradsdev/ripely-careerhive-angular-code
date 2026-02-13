import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerVideosComponent } from './career-videos.component';

describe('CareerVideosComponent', () => {
  let component: CareerVideosComponent;
  let fixture: ComponentFixture<CareerVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

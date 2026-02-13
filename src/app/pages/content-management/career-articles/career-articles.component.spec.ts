import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerArticlesComponent } from './career-articles.component';

describe('CareerArticlesComponent', () => {
  let component: CareerArticlesComponent;
  let fixture: ComponentFixture<CareerArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

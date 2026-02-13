import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBIPageComponent } from './power-bi-page.component';

describe('PowerBIPageComponent', () => {
  let component: PowerBIPageComponent;
  let fixture: ComponentFixture<PowerBIPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerBIPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerBIPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeColumnSectionComponent } from './three-column-section.component';

describe('ThreeColumnSectionComponent', () => {
  let component: ThreeColumnSectionComponent;
  let fixture: ComponentFixture<ThreeColumnSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeColumnSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeColumnSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

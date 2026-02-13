import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateListComponent } from './graduate-list.component';

describe('GraduateListComponent', () => {
  let component: GraduateListComponent;
  let fixture: ComponentFixture<GraduateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

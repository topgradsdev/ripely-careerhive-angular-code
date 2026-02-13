import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlacementsComponent } from './my-placements.component';

describe('MyPlacementsComponent', () => {
  let component: MyPlacementsComponent;
  let fixture: ComponentFixture<MyPlacementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPlacementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

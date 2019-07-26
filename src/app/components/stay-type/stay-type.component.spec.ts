import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StayTypeComponent } from './stay-type.component';

describe('StayTypeComponent', () => {
  let component: StayTypeComponent;
  let fixture: ComponentFixture<StayTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

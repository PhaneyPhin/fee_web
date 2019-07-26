import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPositionComponent } from './user-position.component';

describe('UserPositionComponent', () => {
  let component: UserPositionComponent;
  let fixture: ComponentFixture<UserPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

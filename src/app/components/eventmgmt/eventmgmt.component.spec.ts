import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmgmtComponent } from './eventmgmt.component';

describe('EventmgmtComponent', () => {
  let component: EventmgmtComponent;
  let fixture: ComponentFixture<EventmgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventmgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventmgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

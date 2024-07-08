import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedRoomComponent } from './closed-room.component';

describe('ClosedRoomComponent', () => {
  let component: ClosedRoomComponent;
  let fixture: ComponentFixture<ClosedRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosedRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

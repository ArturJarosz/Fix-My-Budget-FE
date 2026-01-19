import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIgnoreStatusComponent } from './edit-ignore-status.component';

describe('EditIgnoreStatusComponent', () => {
  let component: EditIgnoreStatusComponent;
  let fixture: ComponentFixture<EditIgnoreStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIgnoreStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIgnoreStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionScreenComponent } from './transaction-screen.component';

describe('TransactionScreenComponent', () => {
  let component: TransactionScreenComponent;
  let fixture: ComponentFixture<TransactionScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCategorySummaryComponent } from './transaction-category-summary.component';

describe('TransactionCategorySummaryComponent', () => {
  let component: TransactionCategorySummaryComponent;
  let fixture: ComponentFixture<TransactionCategorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCategorySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCategorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCategorySummaryTableComponent } from './transaction-category-summary-table.component';

describe('TransactionCategorySummaryTableComponent', () => {
  let component: TransactionCategorySummaryTableComponent;
  let fixture: ComponentFixture<TransactionCategorySummaryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCategorySummaryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCategorySummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

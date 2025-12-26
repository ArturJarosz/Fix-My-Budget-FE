import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBigChartComponent } from './transaction-big-chart.component';

describe('TransactionBigChartComponent', () => {
  let component: TransactionBigChartComponent;
  let fixture: ComponentFixture<TransactionBigChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionBigChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionBigChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

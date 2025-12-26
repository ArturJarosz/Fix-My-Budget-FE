import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSmallChartComponent } from './transaction-small-chart.component';

describe('TransactionSmallChartComponent', () => {
  let component: TransactionSmallChartComponent;
  let fixture: ComponentFixture<TransactionSmallChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionSmallChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionSmallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

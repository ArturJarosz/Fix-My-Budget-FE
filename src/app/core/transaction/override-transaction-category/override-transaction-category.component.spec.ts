import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideTransactionCategoryComponent } from './override-transaction-category.component';

describe('OverrideTransactionCategoryComponent', () => {
  let component: OverrideTransactionCategoryComponent;
  let fixture: ComponentFixture<OverrideTransactionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverrideTransactionCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverrideTransactionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

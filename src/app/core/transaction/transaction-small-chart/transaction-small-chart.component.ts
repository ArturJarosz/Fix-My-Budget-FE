import {Component, Input, OnChanges} from '@angular/core';
import {BankTransaction} from "../../../models/models";
import {MeterGroup, MeterItem} from "primeng/metergroup";

@Component({
    selector: 'transaction-small-chart',
    imports: [
        MeterGroup
    ],
    templateUrl: './transaction-small-chart.component.html',
    styleUrl: './transaction-small-chart.component.css'
})
export class TransactionSmallChartComponent implements OnChanges {
    @Input()
    transactions!: BankTransaction[];

    items: MeterItem[] = [];

    ngOnChanges(): void {
        this.items = this.transformData(this.transactions);
    }

    private transformData(transactions: BankTransaction[]): MeterItem[] {
        const totals = transactions.reduce<Record<string, number>>((acc, tx) => {
            const category = tx.category ?? 'Uncategorized';
            acc[category] = (acc[category] ?? 0) + tx.amount;
            return acc;
        }, {});

        const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

        if (grandTotal === 0) {
            return [];
        }

        function getRandomColor(): string {
            // Random bright-ish HSL color
            const hue = Math.floor(Math.random() * 360);
            const saturation = 70;
            const lightness = 50;
            return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
        }

        return Object.entries(totals).map(([category, total]) => {
            const percentage = (total / grandTotal) * 100;

            return {
                label: `${category} (${total.toFixed(2)})`,
                value: percentage,     // 👈 now 0–100, not raw amount
                color: getRandomColor()
            } as MeterItem;
        });
    }
}

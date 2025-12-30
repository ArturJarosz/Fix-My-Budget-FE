import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Fieldset} from 'primeng/fieldset';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {BankTransaction, Category, TransactionType} from '../../../models/models';
import {NgIf} from "@angular/common";

type TimeGrouping = 'YEARS' | 'MONTHS' | 'WEEKS';

interface TimeBucket {
    key: string;
    label: string;
}

@Component({
    selector: 'transaction-big-chart',
    standalone: true,
    imports: [
        Fieldset,
        ChartModule,
        ButtonModule,
        NgIf
    ],
    templateUrl: './transaction-big-chart.component.html',
    styleUrl: './transaction-big-chart.component.css'
})
export class TransactionBigChartComponent implements OnChanges {
    @Input()
    transactions!: BankTransaction[];

    @Input()
    categories!: Category[];

    selectedGrouping: TimeGrouping = 'MONTHS';

    chartData: any;
    chartOptions: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['transactions'] || changes['categories']) {
            this.updateChart();
        }
    }

    onGroupingChange(grouping: TimeGrouping): void {
        if (this.selectedGrouping === grouping) {
            return;
        }
        this.selectedGrouping = grouping;
        this.updateChart();
    }

    private updateChart(): void {
        if (!this.transactions || this.transactions.length === 0) {
            this.chartData = {
                labels: [],
                datasets: []
            };
            return;
        }

        const buckets = this.buildBuckets(this.transactions, this.selectedGrouping);
        const labels = buckets.map(b => b.label);

        const categoryNames = this.getAllCategoryNames();
        const bucketIndexByKey = new Map<string, number>();
        buckets.forEach((b, idx) => bucketIndexByKey.set(b.key, idx));

        // Aggregate amounts:
        // bucketKey -> "income"/"expense" -> categoryName -> total
        const aggregates: Record<
            string,
            {
                income: Record<string, number>;
                expense: Record<string, number>;
            }
        > = {};

        // Decide per-category side (income / expense) based on the first transaction we see
        const categorySide: Record<string, 'income' | 'expense'> = {};

        let maxValue = 0;

        for (const tx of this.transactions) {
            const date = new Date(tx.transactionDate);
            if (isNaN(date.getTime())) {
                continue;
            }

            const bucketKey = this.getBucketForDate(date, this.selectedGrouping);
            if (!bucketIndexByKey.has(bucketKey.key)) {
                continue;
            }

            const rawAmount = tx.amount;
            if (rawAmount === 0) {
                continue;
            }

            const categoryName = tx.category || 'UNCATEGORIZED';
            const isIncome = tx.transactionType === TransactionType.INCOME;
            const absAmount = Math.abs(rawAmount);

            aggregates[bucketKey.key] ??= {
                income: {},
                expense: {}
            };

            // Assign the category to a side once, based on the first transaction
            if (!categorySide[categoryName]) {
                categorySide[categoryName] = isIncome ? 'income' : 'expense';
            }

            const side = categorySide[categoryName]; // 'income' or 'expense'
            const bucketGroup = aggregates[bucketKey.key];
            const group = side === 'income' ? bucketGroup.income : bucketGroup.expense;

            group[categoryName] ??= 0;
            group[categoryName] += absAmount;

            if (group[categoryName] > maxValue) {
                maxValue = group[categoryName];
            }
            console.log(" === maxValue: ", maxValue);
        }

        // Prepare datasets: exactly ONE dataset per category,
        // assigned either to the "income" or "expense" stack.
        const datasets: any[] = [];
        const colorByCategory = this.buildCategoryColorMap(categoryNames);

        for (const categoryName of categoryNames) {
            const baseColor = colorByCategory.get(categoryName) || '#888888';
            const side = categorySide[categoryName];

            // If this category never actually appeared in the data, skip it
            if (!side) {
                continue;
            }

            const data = new Array<number>(labels.length).fill(0);

            buckets.forEach((bucket, idx) => {
                const entry = aggregates[bucket.key];
                if (!entry) {
                    return;
                }

                const value =
                    side === 'income'
                        ? entry.income[categoryName] ?? 0
                        : entry.expense[categoryName] ?? 0;

                data[idx] = value;
            });

            datasets.push({
                label: categoryName, // no "(Income)" / "(Expense)" suffix
                stack: side,         // 'income' or 'expense'
                backgroundColor: side === 'income'
                    ? this.withOpacity(baseColor, 0.8)
                    : this.withOpacity(baseColor, 0.8),
                borderColor: baseColor,
                borderWidth: 1,
                data
            });
        }

        this.chartData = {
            labels,
            datasets
        };

        const safeMax = maxValue || 1;
        const paddedMax = safeMax * 1.1;

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: this.getXAxisTitle()
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                }
            }
        };
    }


    private buildBuckets(transactions: BankTransaction[], grouping: TimeGrouping): TimeBucket[] {
        const keyToLabel = new Map<string, string>();

        for (const tx of transactions) {
            const date = new Date(tx.transactionDate);
            if (isNaN(date.getTime())) {
                continue;
            }

            const bucket = this.getBucketForDate(date, grouping);
            if (!keyToLabel.has(bucket.key)) {
                keyToLabel.set(bucket.key, bucket.label);
            }
        }

        // Sort by key (which is built to sort chronologically)
        const keys = Array.from(keyToLabel.keys()).sort((a, b) => a.localeCompare(b));

        return keys.map(key => ({
            key,
            label: keyToLabel.get(key) || key
        }));
    }

    private getBucketForDate(date: Date, grouping: TimeGrouping): TimeBucket {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1..12
        const pad = (n: number) => n.toString().padStart(2, '0');

        if (grouping === 'YEARS') {
            return {
                key: `${year}`,
                label: `${year}`
            };
        }

        if (grouping === 'MONTHS') {
            return {
                key: `${year}-${pad(month)}`,
                label: `${year}-${pad(month)}`
            };
        }

        // WEEKS: use ISO week
        const {isoYear, isoWeek} = this.getIsoWeek(date);
        return {
            key: `${isoYear}-W${pad(isoWeek)}`,
            label: `${isoYear} W${pad(isoWeek)}`
        };
    }

    private getIsoWeek(date: Date): { isoYear: number; isoWeek: number } {
        const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        // Thursday in current week decides the year.
        tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
        const isoYear = tmp.getUTCFullYear();
        const yearStart = new Date(Date.UTC(isoYear, 0, 1));
        const isoWeek = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return {isoYear, isoWeek};
    }

    private getAllCategoryNames(): string[] {
        const set = new Set<string>();

        if (this.categories) {
            for (const c of this.categories) {
                if (c.name) {
                    set.add(c.name);
                }
            }
        }

        // Also include any categories appearing in transactions that may not be in the list
        if (this.transactions) {
            for (const tx of this.transactions) {
                const name = tx.category || 'UNCATEGORIZED';
                set.add(name);
            }
        }

        return Array.from(set.values()).sort((a, b) => a.localeCompare(b));
    }

    private buildCategoryColorMap(categoryNames: string[]): Map<string, string> {
        const map = new Map<string, string>();

        // Prefer colors from Category list where available
        const colorByName = new Map<string, string>();
        if (this.categories) {
            for (const c of this.categories) {
                if (c.name && c.color) {
                    colorByName.set(c.name, c.color);
                }
            }
        }

        const fallbackColors = [
            '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
            '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395',
            '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300'
        ];

        let fallbackIndex = 0;
        for (const name of categoryNames) {
            const fromCategory = colorByName.get(name);
            if (fromCategory) {
                map.set(name, fromCategory);
            } else {
                const color = fallbackColors[fallbackIndex % fallbackColors.length];
                map.set(name, color);
                fallbackIndex++;
            }
        }

        // Special color for Uncategorized if not already set
        if (map.has('UNCATEGORIZED')) {
            map.set('UNCATEGORIZED', '#888888');
        }
        return map;
    }

    private withOpacity(hexColor: string, alpha: number): string {
        // Very simple conversion: supports #RRGGBB
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        if (!match) {
            return hexColor;
        }
        const r = parseInt(match[1], 16);
        const g = parseInt(match[2], 16);
        const b = parseInt(match[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    private getXAxisTitle(): string {
        switch (this.selectedGrouping) {
            case 'YEARS':
                return 'Years';
            case 'MONTHS':
                return 'Months';
            case 'WEEKS':
                return 'Weeks';
        }
    }
}

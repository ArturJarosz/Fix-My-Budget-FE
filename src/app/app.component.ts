import {Component, signal} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    standalone: false
})
export class AppComponent {
    title = 'Fix-My-Budget-FE';
    search: string = '';
    selectedNav: string = 'Home';
    navs = signal([
        {label: 'Home', icon: 'pi pi-list-check'},
        {label: 'Categories', icon: 'pi pi-tags'},
    ]);
    bottomNavs = signal([
        {label: 'Question', icon: 'pi pi-question-circle'},
        {label: 'Settings', icon: 'pi pi-cog'}
    ]);
}

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
        { label: 'Home', icon: 'pi pi-home' },
        { label: 'Bookmark', icon: 'pi pi-bookmark' },
        { label: 'Users', icon: 'pi pi-users' },
        { label: 'Comments', icon: 'pi pi-comments' },
        { label: 'Calendar', icon: 'pi pi-calendar' }
    ]);
    bottomNavs = signal([
        { label: 'Question', icon: 'pi pi-question-circle' },
        { label: 'Settings', icon: 'pi pi-cog' }
    ]);
}

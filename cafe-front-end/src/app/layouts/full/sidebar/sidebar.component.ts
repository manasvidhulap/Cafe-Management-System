import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import jwtDecode from 'jwt-decode';
import { MenuItems } from '../../../shared/menu-items';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  userRole: any;
  token: any = localStorage.getItem('token');
  tokenPayload: any;
  menuItemList: Array<any> = [];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.tokenPayload = jwtDecode(this.token);
    this.userRole = this.tokenPayload?.role;
    if (this.userRole === 'user') {
      this.menuItemList = this.menuItems.getMenuitem().filter((item: any) => item?.role === '')
    } else {
      this.menuItemList = this.menuItems.getMenuitem().filter((item: any) => item?.role === 'admin')
    }
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

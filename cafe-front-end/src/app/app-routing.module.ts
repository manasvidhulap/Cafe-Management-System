import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteGuardService } from './services/route-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './material-component/manage-category/manage-category.component';
import { ManageProductComponent } from './material-component/manage-product/manage-product.component';
import { ManageOrderComponent } from './material-component/manage-order/manage-order.component';
import { ViewBillComponent } from './material-component/view-bill/view-bill.component';
import { ManageUserComponent } from './material-component/manage-user/manage-user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'category',
        component: ManageCategoryComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin'],
        },
      },
    
      {
        path: 'product',
        component: ManageProductComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin'],
        },
      },
      {
        path: 'order',
        component: ManageOrderComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
    
      {
        path: 'bill',
        component: ViewBillComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
    
      {
        path: 'user',
        component: ManageUserComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin'],
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        }
      }
    ],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

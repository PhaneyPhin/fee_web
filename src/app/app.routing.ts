import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerComponent } from './components/customer/customer.component';
import { P404Component } from './components/error/404.component';
import { FeeComponent } from './components/fee/fee.component';
import { fee_types_lange } from './language/fee_type';
import { StayTypeComponent } from './components/stay-type/stay-type.component';
import { FeeTypeComponent } from './components/fee-type/fee-type.component';
import { PaymentTypeComponent } from './components/payment-type/payment-type.component';
import { PaybillComponent } from './components/paybill/paybill.component';
import { UserPositionComponent } from './components/user-position/user-position.component';
import { AuthGuard } from './auth.service';
import { TimeoutComponent } from './components/timeout/timeout.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';



export const routes: Routes = [
    {
      path:"",
      redirectTo:"/login",
      pathMatch:'full'
    },{
      path:'',
      canActivate:[AuthGuard],
      canActivateChild:[AuthGuard],
      component:LayoutComponent,
      data:{
        title:{
          TH:"หน้าแรก",
          EN:"Home"
        }
      },
      children:[
        {
          path:"customer",
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          component:CustomerComponent,
          data:{
            title:{TH:"ข้อมูลลูกค้า",EN:"Customer Data"}
          }
        }, {
          path:"dashboard",
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          component:DashboardComponent,
          data:{
            title:{TH:"สรุปข้อมูล",EN:"Dashboard"}
          }
        },{
          path:"place_type",
          component:StayTypeComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ข้อมูลชนิดที่อยู่",EN:"Place Type Data"}
          }
        },
        {
          path:"fee",
          component:FeeComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ข้อมูลค่าธรรมเนียม",EN:"Fee Data"}
          }
        },{
          path:"fee_type",
          component:FeeTypeComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ข้อมูลชนิดค่าธรรมเนียม",EN:"Fee Type Data"}
          }
        },{
          path:"payment_type",
          component:PaymentTypeComponent,
          data:{
            title:{TH:"ข้อมูลประเภทการชำระ",EN:"Payment Type Data"}
          }
        },{
          path:"paybill",
          component:PaybillComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ข้อมูลการคังชำระ",EN:"Payment Data"}
          }
        },{
          path:"invoice",
          component:InvoiceComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ข้อมูลการชำระ",EN:"Invoice"}
          }
        },{
          path:"user_position",
          component:UserPositionComponent,
          canActivate:[AuthGuard],
          canActivateChild:[AuthGuard],
          data:{
            title:{TH:"ตำแหน่งข้องพนักงาน",ENL:"User Position"}
          }
        }
      ]
    },{
      path:"timeout",
      component:TimeoutComponent
    },{
      path:"login",
      component:LoginComponent
    },
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // },
  // {
  //   path: '404',
  //   component: P404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   component: P500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   data: {
  //     title: 'Login Page'
  //   }
  // },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: {
  //     title: 'Register Page'
  //   }
  // },
  // {
  //   path: '',
  //   component: DefaultLayoutComponent,
  //   data: {
  //     title: 'Home'
  //   },
  //   children: [
  //     {
  //       path: 'base',
  //       loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
  //     },
  //     {
  //       path: 'buttons',
  //       loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
  //     },
  //     {
  //       path: 'charts',
  //       loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
  //     },
  //     {
  //       path: 'dashboard',
  //       loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
  //     },
  //     {
  //       path: 'icons',
  //       loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
  //     },
  //     {
  //       path: 'notifications',
  //       loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
  //     },
  //     {
  //       path: 'theme',
  //       loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
  //     },
  //     {
  //       path: 'widgets',
  //       loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
  //     }
  //   ]
  // },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

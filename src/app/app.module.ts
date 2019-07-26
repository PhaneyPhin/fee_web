import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {DataTableModule} from "angular-6-datatable";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerComponent } from './components/customer/customer.component';
import { P404Component } from './components/error/404.component';
import { P500Component } from './components/error/500.component';
import { FeeComponent } from './components/fee/fee.component';
import { FeeTypeComponent } from './components/fee-type/fee-type.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent, ModalContentComponent } from './components/login/login.component';
import { PaybillComponent } from './components/paybill/paybill.component';
import { PaymentTypeComponent } from './components/payment-type/payment-type.component';
import { TimeoutComponent } from './components/timeout/timeout.component';
import { UserComponent } from './components/user/user.component';
import { UserPositionComponent } from './components/user-position/user-position.component';
import { StayTypeComponent } from './components/stay-type/stay-type.component';
import { MaterialModule } from './material/material.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AuthGuard } from './auth.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    FormsModule,
    ReactiveFormsModule ,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    MaterialModule,
    DataTableModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    NgxDatatableModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    CustomerComponent,
    P404Component,
    P500Component,
    FeeComponent,
    FeeTypeComponent,
    LayoutComponent,
    LoginComponent,
    PaybillComponent,
    PaymentTypeComponent,
    TimeoutComponent,
    UserComponent,
    UserPositionComponent,
    StayTypeComponent,
    TimeoutComponent,
    PaginatorComponent,
    InvoiceComponent,
    ModalContentComponent,
    DashboardComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },AuthGuard],
  bootstrap: [ AppComponent ],
  entryComponents:[ModalContentComponent]
})
export class AppModule { }

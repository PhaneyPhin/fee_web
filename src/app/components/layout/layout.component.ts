import { Component, OnInit, Inject, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { navItems } from '../../_nav';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";
import { filter } from 'rxjs/operators'
import { BnNgIdleService } from 'bn-ng-idle';import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
const layout_language={
  TH:{
    confirm_logout:"คุณต้องการออกจากระบบใช้หรือไหม",
    want_logout:"ออกจากระบบ",
    close_page:"ปิดหน้านี้"
  },
  EN:{
    confirm_logout:"Are you sure to logout",
    want_logout:"logout",
    close_page:"close"
  }
};
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnDestroy, OnInit {
  public all_navItems:any = navItems;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  breadcrumbs = [];
  municipality:any;
  lang = localStorage.getItem('lang') == "EN" ? "EN" : "TH";
  public navItems:any = this.all_navItems[this.lang];
  language;
  _reload=false;
  constructor(private chRef: ChangeDetectorRef,private ngZone:NgZone,private service:MyserviceService,private router: Router, private route: ActivatedRoute,private bnIdle: BnNgIdleService, @Inject(DOCUMENT) _document?: any) {
    this.bnIdle.startWatching(1000).subscribe((res) => {
      if(res) {
          sessionStorage.removeItem('user');
          this.router.navigate(["/timeout"])
      }
    })
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    this.route.queryParams.subscribe(params => {
      this.lang = params['lang'];
      if (this.lang != 'EN' && this.lang != 'TH') {
        this.lang = localStorage.getItem('lang') == 'EN' ? 'EN' : 'TH';
      } else {
        localStorage.setItem('lang', this.lang);
      }
      this.language=layout_language[this.lang]
    });

    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
    //   //set breadcrumbs
    //   let root: ActivatedRoute = this.route.root;

    // });
  }
  user:any;
  changeLang(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    var url = this.router.url;
    console.log(this.router.url);
    this.navItems = this.all_navItems[this.lang];
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { lang: lang },
        queryParamsHandling: 'merge'
      }
    );
  }
  refresh(){
    this._reload=false;
    var count=0;
    this.service.postData({},"get_summary_bill").then((result:any)=>{

      this.ngZone.run(()=>{
        this.all_navItems.EN[7].badge={text:result.number,variant:'secondary'};
        this.all_navItems.TH[7].badge={text:result.number,variant:'secondary'};
        this.navItems=[];
        this.navItems=this.all_navItems[this.lang]
        console.log(this.navItems)
        this.chRef.detectChanges();
        count++;
        if(count==2){
          this._reload=true;
        }
      })
    })
    this.service.postData({},"get_summary_invoice").then((result:any)=>{

      this.ngZone.run(()=>{
        this.all_navItems.EN[8].badge={text:result.number,variant:'secondary'};
        this.all_navItems.TH[8].badge={text:result.number,variant:'secondary'};
        this.navItems=this.all_navItems[this.lang]
        this.navItems=[];
        this.navItems=this.all_navItems[this.lang];
        this.chRef.detectChanges();

        count++;
        if(count==2){
          this._reload=true;
        }
      })
    })
    // alert(2);
  }
  ngOnInit() {
    this.refresh();

    setInterval(()=>{
      this.refresh();
    },60000);
    this.municipality=(sessionStorage.getItem('municipality'))
    if(this.municipality!=undefined){
      this.municipality=JSON.parse(this.municipality);
    }
    var token=sessionStorage.getItem('token');

    this.service.checklogin(token).then((result:any)=>{
      console.log(result);
      this.user=result.gen_token;
      console.log(this.user)
    });
    this.setBreadCrumb();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setBreadCrumb();
      }

    });
  }
  setBreadCrumb(){

      let child = this.route;
      console.log(child);
      this.breadcrumbs=[];
      while (child != null) {
        if (child.snapshot.data && child.snapshot.data['title']) {
          this.breadcrumbs.push(child.snapshot.data['title']);

          child = child.firstChild;
          // console.log(child);

        } else {
          break;
        }

      console.log(this.breadcrumbs);
      // console.log(this.route.root);
      // console.log(this.route.root.firstChild.snapshot.data['title'])
    }
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
  logout(){
    Swal.fire({
      title: this.language.confirm_logout,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_logout,
      cancelButtonText: this.language.close_page
    }).then((result) => {
      if (result.value) {
        sessionStorage.removeItem('token');
        window.location.href="http://203.150.210.26:3003/";
      }
    });
  }
}

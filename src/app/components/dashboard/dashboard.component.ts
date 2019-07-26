import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyserviceService } from '../../provider/myservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;
  constructor(private service:MyserviceService,private chRef: ChangeDetectorRef,private route: ActivatedRoute, private router: Router) { }
  cards={
    TH:[
        {
          name:"ยอดคงค้าง(ทั้งหมด)",
          number:0,
          text:"เป็นเงิน",
          quantity:0,
          icon:"fas fa-scroll",
          url:"/paybill",
          unit:"บาท"
        },{
          name:"ใบทวงหนี้ (ทั้งหมด)",
          number:0,
          text:"เป็นเงิน",
          url:"/",
          icon:"fas fa-paste",
          quantity:0,
          unit:"บาท"
        },{
          name:"ชำระเงิน(ทั้งหมด)",
          number:0,
          text:"เป็นเงิน",
          quantity:0,
          url:"/invoice",
          icon:"fas fa-money-check-alt",
          unit:"บาท"
        },{
          name:"ปรัปปรุงข้อมูล (ทั้งหมด)",
          number:0,
          text:"เป็นจำนวน",
          quantity:0,
          url:"/",
          icon:"fas fa-building",
          unit:"อาควร"
        },{
          name:"ยอดคงค้าง(ล่าสุด)",
          number:0,
          text:"เป็นเงิน",
          quantity:0,
          icon:"fas fa-scroll",
          url:"/paybill",
          unit:"บาท"
        },{
          name:"ใบทวงหนี้ (รายวัน)",
          number:0,
          text:"เป็นเงิน",
          url:"/",
          icon:"fas fa-paste",
          quantity:0,
          unit:"บาท"
        },{
          name:"ชำระเงิน(รายวัน)",
          number:0,
          text:"เป็นเงิน",
          quantity:0,
          url:"/invoice",
          icon:"fas fa-money-check-alt",
          unit:"บาท"
        },{
          name:"ปรัปปรุงข้อมูล (รายวัน)",
          number:0,
          text:"เป็นจำนวน",
          quantity:0,
          url:"/",
          icon:"fas fa-building",
          unit:"อาคาร"
        }
      ],
      EN:[
        {
          name:"Bill (All)",
          number:0,
          text:"as money",
          quantity:0,
          icon:"fas fa-scroll",
          url:"/paybill",
          unit:"baht"
        },{
          name:"invoice debt (all)",
          number:0,
          text:"as money",
          url:"/",
          icon:"fas fa-paste",
          quantity:0,
          unit:"baht"
        },{
          name:"Invoice(all)",
          number:0,
          text:"as money",
          quantity:0,
          url:"/invoice",
          icon:"fas fa-money-check-alt",
          unit:"baht"
        },{
          name:"Update data (all)",
          number:0,
          text:"as number",
          quantity:0,
          url:"/",
          icon:"fas fa-building",
          unit:"building"
        },{
          name:"Bill (latest)",
          number:0,
          text:"as money",
          quantity:0,
          icon:"fas fa-scroll",
          url:"/paybill",
          unit:"baht"
        },{
          name:"invoice debt (dailay)",
          number:0,
          text:"as money",
          url:"/",
          icon:"fas fa-paste",
          quantity:0,
          unit:"baht"
        },{
          name:"Invoice(daily)",
          number:0,
          text:"as money",
          quantity:0,
          url:"/invoice",
          icon:"fas fa-money-check-alt",
          unit:"baht"
        },{
          name:"Update data (daily)",
          number:0,
          text:"as number",
          quantity:0,
          url:"/",
          icon:"fas fa-building",
          unit:"building"
        }
      ]

  }

  isLoading=true;
  ngOnInit() {
    this.service.postData({},"get_summary_bill").then((result:any)=>{
      this.cards.EN[0].number=result.number;
      this.cards.EN[0].quantity=result.quantity;
      this.cards.TH[0].number=result.number;
      this.cards.TH[0].quantity=result.quantity;
    })
    this.service.postData({},"get_summary_invoice").then((result:any)=>{
      this.cards.EN[2].number=result.number;
      this.cards.EN[2].quantity=result.quantity;
      this.cards.TH[2].number=result.number;
      this.cards.TH[2].quantity=result.quantity;
      this.isLoading=false;
    })
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        // this.language=fee_lange[this.lang];
      }else{
        // this.language=fee_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }


}

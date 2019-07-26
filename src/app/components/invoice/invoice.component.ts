import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {invoice_lange} from "../../language/invoice";
import Swal from 'sweetalert2';
import { MyserviceService } from '../../provider/myservice.service';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  actions=[
    {id:0,action_type:{TH:"เสดงรายการการชำระ",EN:"Invoice Data"}},
    {id:1,action_type:{TH:"ชำระเงิน",EN:"Pay"}},

  ]
  paybills:any;
  all_paybill:any;
  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;
  isLoading=true;
  action=this.actions[0];
  paybill:any;
  vat_price=0;
  payments:any;
  submitted=false;
  paytype="";
  constructor(private route:ActivatedRoute,router:Router,private service:MyserviceService) { }

  ngOnInit() {
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=invoice_lange[this.lang];
      }else{
        this.language=invoice_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchFee_type(event){
    this.paybills=this.all_paybill.filter((item)=>{
      return compare(item.bill_id)||
      compare(item.fee_id)||
      compare(item.fee_description)||
      compare(item.customer_id)||
      compare(item.customer_name)||
      compare(item.user_id)||
      compare(item.create_datetime)||
      compare(item.due_date);

    })
    function compare(type){
      return type.toLowerCase().indexOf(event.target.value.toLowerCase())>-1;
    }
  }
  refreshData(){
    this.submitted=false;
    this.action=this.actions[0];
    this.isLoading=true;
    this.service.postData({},"get_invoice").then((result:any)=>{
      console.log(result);
      this.isLoading=false;
      this.all_paybill=result.filter((item)=>{
        var res:any;
        res=item;
        res.createDate=this.formatDate(new Date(item.create_datetime));
        res.dueDate=this.formatDate(new Date(item.due_date));
        res.pay_datetime=new Date(res.pay_datetime);
        res.pay_datetime=new Date(res.pay_datetime.setHours(res.pay_datetime.getHours()+7));
        res.pay_datetime=this.formatDate(res.pay_datetime)+" "+res.pay_datetime.toISOString().substring(11,19);
        return res;
      });
      this.paybills=this.all_paybill;
    },(err)=>{
      console.log(err);
    })
  }

  formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour=date.getHours();
    var min=date.getMinutes();
    var sec=date.getSeconds();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
  delete(bill){
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warining_delete,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close
    }).then((result) => {
      if (result.value) {

        this.service.postData({bill_id:bill.bill_id},"cancel_bill").then(result=>{
          this.isLoading=false;
          Swal.fire(
            this.language.deleted,
            '',
            'success'
          ).then((result) => {
            this.refreshData();
          })
        },err=>{
          Swal.fire(this.language.no_internet,'','error' );
          this.isLoading=false;
        })
      }
    });
  }
  update(bill){
    this.paybill=bill;
    this.action=this.actions[1];
    this.isLoading=true;
    this.vat_price=(1-parseFloat(bill.vat))*parseFloat(bill.total_price);
    //  this.isLoading=true;
    this.service.postData({},"get_payment").then((result)=>{
      this.payments=result;
      this.isLoading=false;

    },err=>{
      console.log(err)
    })
  }
  back(){
    this.refreshData();
  }

}

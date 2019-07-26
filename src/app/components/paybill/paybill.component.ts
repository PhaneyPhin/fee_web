import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {paybill_lange} from "../../language/paybill";
import Swal from 'sweetalert2';
import { MyserviceService } from '../../provider/myservice.service';
@Component({
  selector: 'app-paybill',
  templateUrl: './paybill.component.html',
  styleUrls: ['./paybill.component.scss']
})
export class PaybillComponent implements OnInit {
  actions=[
    {id:0,action_type:{TH:"เสดงรายการการคังชำระ",EN:"Bill Data"}},
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
        this.language=paybill_lange[this.lang];
      }else{
        this.language=paybill_lange[this.lang];
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
    this.service.postData({},"get_bill").then((result:any)=>{
      console.log(result);
      this.isLoading=false;
      this.all_paybill=result.filter((item)=>{
        var res:any;
        res=item;
        res.createDate=this.formatDate(new Date(item.create_datetime));
        res.dueDate=this.formatDate(new Date(item.due_date));
        return res;
      });
      this.paybills=this.all_paybill;
    },(err)=>{
      console.log(err);
    })
  }
  update_bill(){
    this.submitted=true;

    if(this.paytype!=""){
      Swal.fire({
        title: this.language.confirm_update,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.language.want_update,
        cancelButtonText: this.language.close
      }).then((result) => {

        if (result.value) {
          this.isLoading=true;
          this.service.postData({
            bill_id:this.paybill.bill_id,
            fee_id:this.paybill.fee_id,
            customer_id:this.paybill.customer_id,
            user_id:this.paybill.user_id,
            create_datetime:this.paybill.create_datetime,
            fee_price:this.paybill.fee_price,
            vat:this.paybill.vat,
            vat_rate:this.paybill.vat_rate,
            total_price:this.paybill.total_price,
            payment_type_id:this.paytype
          },"update_bill").then((result)=>{
            this.isLoading=false;
            Swal.fire(
              this.language.updated,
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

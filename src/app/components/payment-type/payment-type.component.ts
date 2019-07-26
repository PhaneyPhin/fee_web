import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import {payment_types_lange} from "../../language/payment_type";
@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.scss']
})
export class PaymentTypeComponent implements OnInit {
  submitted=false;
  isLoading=true;
  payments:any;
  all_payment:any;
  search_payment="";
  actions=[
    {id:0,action_type:{TH:"เสดงรายการประเภทการชำระ",EN:"View payment type data"}},
    {id:1,action_type:{TH:"เพิ่มประเภทการชำระ",EN:"Add payment type"}},
    {id:2,action_type:{TH:"แก้ไขประเภทการชำระ",EN:"Edit payment type"}}
  ];

  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;

  action=this.actions[0];
  payment={payment_id:"",payment_description:""};
  constructor(private service:MyserviceService,private chRef: ChangeDetectorRef,private route: ActivatedRoute, private router: Router) {
    this.language=payment_types_lange[this.lang];
   }

  ngOnInit() {
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=payment_types_lange[this.lang];
      }else{
        this.language=payment_types_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchpayment(event){
    this.payments=this.all_payment.filter((item)=>{
      return compare(item.payment_id)||compare(item.payment_description);
    })
    function compare(type){
      return type.toLowerCase().indexOf(event.target.value.toLowerCase())>-1;
    }
  }
  add(){
    this.action=this.actions[1];
  }
  refreshData(){
    this.submitted=false;
    this.payment={payment_id:"",payment_description:""};
    this.action=this.actions[0];
    this.isLoading=true;
    this.search_payment="";
    this.service.postData({},"/get_payment").then((result)=>{
      this.payments=result;
      this.all_payment=result;
      this.isLoading=false;
    },(err)=>{this.isLoading=false;
      Swal.fire(this.language.no_internet,'','error' )
    })
    this.getnextid();


  }
  back(){
    this.refreshData();
  }
  getnextid(){
    this.service.postData({},"getmax_payment_id").then((result:any)=>{
      this.payment.payment_id=result.max_id;
    },err=>{
      Swal.fire(this.language.no_internet,'','error' )

    });
  }
  edit(payment){
    this.action=this.actions[2];
    this.payment=payment;
  }
  save(){
    this.submitted=true;
    if(this.payment.payment_description==""){

    }else{
      var url;
      if(this.action.id==1){
        url="add_payment"
      }else{
        url="edit_payment"
      }
      this.isLoading=true;
      this.service.postData(this.payment,url).then(result=>{
        this.isLoading=false;
        Swal.fire(this.language.saved,'','success' )

        this.refreshData();
      },err=>{
        Swal.fire(this.language.no_internet,'','error' )
      });
    }
  }
  delete(payment){
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warning_delelte,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close
    }).then((result) => {
      if (result.value) {
        this.isLoading=true;
        this.service.postData({payment_id:payment.payment_id},"delete_payment").then(result=>{
          this.isLoading=false;
          Swal.fire(
            this.language.deleted,
            '',
            'success'
          ).then((result) => {
            this.refreshData();
          })
        },err=>{
          Swal.fire(this.language.no_internet,'','error' )
        })
      }
    });
  }

}

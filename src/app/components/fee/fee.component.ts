import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import {fee_lange} from "../../language/fee";
@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {
  isLoading=true;
  fees:any;
  all_fee:any;
  submitted=false;
  actions=[
    {id:0,action_type:{TH:"เสดงข้อมูลค่าธรรมเนียม",EN:"View fee data"}},
    {id:1,action_type:{TH:"เพิ่มข้อมูลค่าธรรมเนียม",EN:"add fee data"}},
    {id:2,action_type:{TH:"แก้ไขข้อมูลค่าธรรมเนียม",EN:"edit fee data"}}
  ];

  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;

  dataTable: any="";
  action=this.actions[0];
  fee_types:any;
  fee={fee_id:"",fee_description:"",fee_date:"",fee_type_id:"",fee_price:""};
  constructor(private service:MyserviceService,private chRef: ChangeDetectorRef,private route: ActivatedRoute, private router: Router) {
    this.language=fee_lange[this.lang];
   }
  ngOnInit() {
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=fee_lange[this.lang];
      }else{
        this.language=fee_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchFee(event){
    this.fees=this.all_fee.filter((item)=>{
      return compare(item.fee_id)||compare(item.fee_description)||compare(item.fee_type_description)||compare(item.fee_date);
    })
    function compare(type){
      return type.toLowerCase().indexOf(event.target.value.toLowerCase())>-1;
    }
  }
  refreshData(){
    this.submitted=false;
    this.fee={fee_id:"",fee_description:"",fee_date:"",fee_type_id:"",fee_price:""};
    this.action=this.actions[0];
    this.isLoading=true;

    this.service.postData({},"getfee_data").then((result:any)=>{

      this.isLoading=true;
      this.fees=result.map((item)=>{
        var date=new Date(item.fee_date);
        date.setHours(date.getHours()+7);
        item.show_date=this.formatDate(date);
        item.fee_date=date.toISOString().substring(0,10);
        return item;
      });
      this.all_fee=result.map((item)=>{
        var date=new Date(item.fee_date);
        date.setHours(date.getHours()+7);
        item.show_date=this.formatDate(date);
        item.fee_date=date.toISOString().substring(0,10);
        return item;
      });
      this.isLoading=false;
    },(err)=>{this.isLoading=false;
      Swal.fire(this.language.no_internet,'','error' )
      this.isLoading=false;
    })
    this.getnextid();
    this.action=this.actions[0];
  }

  getnextid(){

    this.service.postData({},"getmax_fee_id").then((result:any)=>{
      this.fee.fee_id=result.max_id;
    },(err)=>{this.isLoading=false;
      Swal.fire(this.language.no_internet,'','error' )
    });
  }
  add(){
    this.isLoading=true;
    this.action=this.actions[1];
    this.service.postData({},"get_fee_type").then((result)=>{
      this.isLoading=false;
      this.fee_types=result;
    })
  }
  edit(fee){
    this.fee=fee;
    this.action=this.actions[2];
    this.isLoading=true;
    this.service.postData({},"get_fee_type").then((result)=>{
      this.isLoading=false;
      this.fee_types=result;
    })
  }
  isDate(date){

    if(date==''){
      return true;
    }else{
      var d=new Date(date);
      return !isNaN(d.getTime())
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
  save(){
    var url;
    this.submitted=true;
    console.log(this.fee);
    var d=new Date(this.fee.fee_date);
    console.log(d);
    if(this.action.id==1){
      url="add_fee";
    }else if(this.action.id==2){
      url="edit_fee";
    }

    if(this.fee.fee_id!=""&&this.fee.fee_description!=""&&this.fee.fee_date!=""&&this.fee.fee_price!=""&&!isNaN(d.getTime())&&this.fee.fee_type_id!=""&&this.isFloat(this.fee.fee_price)){
      this.isLoading=true;
      this.service.postData(this.fee,url).then(result=>{
        this.isLoading=false;
        Swal.fire(
          this.language.saved,
          '',
          'success'
        ).then(result=>{
          this.refreshData();
        })
      },(err)=>{this.isLoading=false;
        Swal.fire(this.language.no_internet,'','error' );
      });
    }
  }
  back(){
    this.refreshData();
  }
  delete(fee){
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warning_delete,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close
    }).then((result) => {
      if(result.value){
        this.isLoading=true;
        this.service.postData({fee_id:fee.fee_id},"delete_fee").then((result)=>{
          this.isLoading=false;
          Swal.fire(
            this.language.deleted,
            '',
            'success'
          ).then((result) => {
            this.refreshData();
          })
        },(err)=>{this.isLoading=false;
          Swal.fire(this.language.no_internet,'','error' )
        })
      }
    });

  }
  isFloat=value=> !/^\s*$/.test(value) && !isNaN(value)
}

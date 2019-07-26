import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import {fee_types_lange} from "../../language/fee_type";
@Component({
  selector: 'app-fee-type',
  templateUrl: './fee-type.component.html',
  styleUrls: ['./fee-type.component.scss']
})
export class FeeTypeComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  columns = [
    { prop: 'name', summaryFunc: () => null },
    { name: 'Gender', summaryFunc: (cells) => this.summaryForGender(cells) },
    { name: 'Company', summaryFunc: () => null }
  ];

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `https://raw.githubusercontent.com/swimlane/ngx-datatable/master/assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  private summaryForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }

  submitted=false;
  isLoading=true;
  fee_types:any;
  all_fee_type:any;
  search_fee_type="";
  actions=[
    {id:0,action_type:{TH:"เสดงรายการชนิดค่าธรรมเนียม",EN:"View fee type data"}},
    {id:1,action_type:{TH:"เพิ่มชนิดค่าธรรมเนียม",EN:"Add fee type"}},
    {id:2,action_type:{TH:"แก้ไขชนิดค่าธรรมเนียม",EN:"Edit fee type"}}
  ];

  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;

  action=this.actions[0];
  fee_type={fee_type_id:"",fee_type_description:""};
  constructor(private service:MyserviceService,private chRef: ChangeDetectorRef,private route: ActivatedRoute, private router: Router) {
    this.language=fee_types_lange[this.lang];
    this.fetch((data) => {
      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
   }

  ngOnInit() {
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=fee_types_lange[this.lang];
      }else{
        this.language=fee_types_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchFee_type(event){
    this.fee_types=this.all_fee_type.filter((item)=>{
      return compare(item.fee_type_id)||compare(item.fee_type_description);
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
    this.fee_type={fee_type_id:"",fee_type_description:""};
    this.action=this.actions[0];
    this.isLoading=true;
    this.search_fee_type="";
    this.service.postData({},"/get_fee_type").then((result)=>{
      this.fee_types=result;
      this.all_fee_type=result;
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
    this.service.postData({},"getmax_fee_type_id").then((result:any)=>{
      this.fee_type.fee_type_id=result.max_id;
    },err=>{
      Swal.fire(this.language.no_internet,'','error' )

    });
  }
  edit(fee){
    this.action=this.actions[2];
    this.fee_type=fee;
  }
  save(){
    this.submitted=true;
    if(this.fee_type.fee_type_description==""){

    }else{
      var url;
      if(this.action.id==1){
        url="add_fee_type"
      }else{
        url="edit_fee_type"
      }
      this.isLoading=true;
      this.service.postData(this.fee_type,url).then(result=>{
        this.isLoading=false;
        Swal.fire(this.language.saved,'','success' )

        this.refreshData();
      },err=>{
        Swal.fire(this.language.no_internet,'','error' )
      });
    }
  }
  delete(fee){
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warning_delelte,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close_page
    }).then((result) => {
      if (result.value) {
        this.isLoading=true;
        this.service.postData({fee_type_id:fee.fee_type_id},"delete_fee_type").then(result=>{
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

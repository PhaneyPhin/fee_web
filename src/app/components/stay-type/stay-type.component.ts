import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import {place_types_lange} from "../../language/place_type";
@Component({
  selector: 'app-stay-type',
  templateUrl: './stay-type.component.html',
  styleUrls: ['./stay-type.component.scss']
})
export class StayTypeComponent implements OnInit {
  isLoading=true;
  all_place_type:any;
  place_types:any;
  actions=[
    {id:0,action_type:{TH:"เสดงรายการชนิดที่อยู่",EN:"Show place type"}},
    {id:1,action_type:{TH:"เพิ่มชนิดที่อยู่",EN:"add place type"}},
    {id:2,action_type:{TH:"แก้ไขชนิดที่อยู่",EN:"edit place type"}}
  ];

  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;
  search_place_type:any;
  errors={place_type_description:false};
  dataTable: any="";
  action=this.actions[0];
  submitted=false;
  place_type={place_type_id:"",place_type_description:""};
  constructor(private service:MyserviceService,private chRef: ChangeDetectorRef,private route: ActivatedRoute, private router: Router) {
    this.language=place_types_lange[this.lang];
   }

  ngOnInit() {
    console.log(this.action.action_type[this.lang])
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=place_types_lange[this.lang];
      }else{
        this.language=place_types_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchPlace_type(event){

    console.log(this.search_place_type);
    this.place_types=this.all_place_type.filter((item)=>{
      return compare(item.place_type_id)||compare(item.place_type_description);
    })
    function compare(type){
      return type.toLowerCase().indexOf(event.target.value.toLowerCase())>-1;
    }
  }
  back(){
    this.refreshData();
  }
  refreshData(){
    this.submitted=false;
    this.place_type={place_type_id:"",place_type_description:""};
    this.action=this.actions[0];
    this.isLoading=true;
    this.search_place_type="";
    this.service.postData({},"/get_place_type").then((result)=>{
      this.isLoading=false;
      this.all_place_type=result;
      this.place_types=result;
      this.isLoading=false;
    },(err)=>{
      Swal.fire(this.language.no_internet,'','error' )
      this.isLoading=false;
    })
    this.getnextid();


  }
  getnextid(){
    this.isLoading=true;
    this.service.postData({},"getmax_place_type_id").then((result:any)=>{
      this.isLoading=false;
      this.place_type.place_type_id=result.max_id;
    },err=>{
      Swal.fire(this.language.no_internet,'','error' );
      this.isLoading=false;
    });
  }
  edit(place){
    this.action=this.actions[2];
    this.place_type=place;
  }
  add(){
    this.getnextid();
    this.action=this.actions[1];
  }
  save(){
    this.submitted=true;
    if(this.place_type.place_type_description==""){
      // Swal.fire('กรุณากรอกรายละเอียดที่อยู่!','','error' );
      this.errors.place_type_description=true;
    }else{
      var url;
      if(this.action.id==1){
        url="add_place_type"
      }else{
        url="edit_place_type"
      }
      this.isLoading=true;
      this.service.postData(this.place_type,url).then(result=>{
        Swal.fire(this.language.saved,'','success' ).then(result=>{
          this.isLoading=false;
          this.refreshData();
        });

      },err=>{
        Swal.fire(this.language.no_internet,'','error' );
        this.isLoading=false;
      });
    }
  }
  delete(place){
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warining_delete,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close_page
    }).then((result) => {
      if (result.value) {
        this.isLoading=true;
        this.service.postData({place_type_id:place.place_type_id},"delete_place_type").then(result=>{
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

}

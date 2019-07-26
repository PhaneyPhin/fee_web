import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../../provider/myservice.service';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user_data={username:"",password:""}
  isLoading=true;
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService,private router:Router,private service:MyserviceService,private route:ActivatedRoute){
    this.route.queryParams.subscribe(params => {

      if(params['token']){

        var token=params['token']
        console.log(params['token']);

        this.service.checklogin(token).then((result:any)=>{
          console.log(result);
          if(result.auth){
            sessionStorage.setItem('token',token);
            sessionStorage.setItem('user',JSON.stringify(result))
            setTimeout(()=>{

              this.service.postData({username:result.gen_token.username},"get_municipality").then((result:any)=>{
                const initialState = {
                  data: result,
                  title: 'Modal with component'
                };
                this.bsModalRef = this.modalService.show(ModalContentComponent, {initialState});
                this.bsModalRef.content.closeBtnName = 'Close';
                this.isLoading=false;

              },err=>{
                Swal.fire("somthing wrong please try agaim");
              })


            },2000)
          }
        },err=>{
          console.log(err);
          window.location.href="http://203.150.210.26:3003/"
        })
      }else{
        token=sessionStorage.getItem('token');
        if(token){
          this.service.checklogin(token).then((result:any)=>{
            console.log(result);
            if(result.auth){
              sessionStorage.setItem('token',token);
              sessionStorage.setItem('user',JSON.stringify(result))
              setTimeout(()=>{
                this.router.navigate(["/dashboard"]);
              },2000)
            }
          },err=>{
            window.location.href="http://203.150.210.26:3003/"
          })
        }else{
          window.location.href="http://203.150.210.26:3003/"
        }
      }
    });
  }
  login(){

    this.service.postData(this.user_data,"login").then((result:any)=>{
      console.log(result);
      if(result.auth){
        sessionStorage.setItem('start_date',new Date().toISOString())
        sessionStorage.setItem('user',JSON.stringify(result));

      }
    },err=>{

    })
  }
}


@Component({
  selector: 'modal-content',
  templateUrl:"modal.html"
})

export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  submitted=false;
  data:any;
  municipality:any="";
  lang="";
  constructor(public bsModalRef: BsModalRef,private router:Router) {}

  ngOnInit() {

  }
  changelang(lang){
    this.lang=lang;
  }
  done(){
    this.submitted=true;
    if(this.municipality!=""){
      var item=this.data.filter((item)=>item.municipality_id==this.municipality)[0];
      sessionStorage.setItem('municipality',JSON.stringify(item));
      this.bsModalRef.hide();
      this.router.navigate(['/dashboard'])
    }
  }
}

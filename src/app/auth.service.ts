import { Injectable } from '@angular/core';
import { Router, CanActivate,CanActivateChild } from '@angular/router';
import { MyserviceService } from './provider/myservice.service';

@Injectable()
export class AuthGuard implements CanActivate,CanActivateChild{
  l
  constructor(public router: Router,private service:MyserviceService) {}
  // ...
  canActivate(): boolean {
    // const user_check = sessionStorage.getItem("user")
    // if (user_check == null) {
    //   this.router.navigate(['login']);
    //   return false;
    // }
    // return true;
    var token=sessionStorage.getItem('token');
    this.service.checklogin(token).then((result:any)=>{
      if(!result.auth){
        this.router.navigate(['/login']);
      }
    },err=>{
      if(err.status==401||err.status==500){
        console.log(err);
        this.router.navigate(['/login']);
      }
    });
    return true;
    //   return this.auth.map((auth) => {
    //     if (auth) {
    //         console.log('authenticated');
    //         return true;
    //     }
    //     console.log('not authenticated');
    //     this.router.navigateByUrl('/login');
    //     return false;
    // }).first();
    // this.service.getData("/me")
  }
  canActivateChild(): boolean {
    const user_check = sessionStorage.getItem("user")
    return true;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
var httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
     })
};

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {
  // url="http://10.255.248.103:3006/api/";
  // url="http://localhost:3000/api/"
  url="http://203.150.210.26:3006/api/";
  encodePassword="";
  constructor(private http:HttpClient) { }
  postData(data,type){
    var token=sessionStorage.getItem('token');
    if(token!=null){
      httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'x-access-token':token
           })
      };
    }else{
      var httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
           })
      };
    }
    return new Promise((resolve,reject)=>{
      console.log(this.url);
      console.log(type);
      this.http.post(this.url + type, JSON.stringify(data), httpOptions).subscribe((result)=>{
        resolve(result);
      },(err)=>{
        reject(err)
      })
    })
  }
  get(url){
    var user:any;
    user=sessionStorage.getItem('user');
    if(user){
      user=JSON.parse(user);
      if(user.token){
        httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json; charset=utf-8',
              'x-access-token':user.token
             })
        };
      }
    }else{
      var httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
           })
      };
    }
    return new Promise((resolve,reject)=>{
      this.http.get(url,httpOptions).subscribe((result)=>{
        resolve(result);
      },(err)=>{
        reject(err);
      })
    })
  }
  getData(type){
    var user:any;
    user=sessionStorage.getItem('user');
    if(user){
      user=JSON.parse(user);
      if(user.token){
        httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json; charset=utf-8',
              'x-access-token':user.token
             })
        };
      }
    }else{
      var httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
           })
      };
    }
    return new Promise((resolve,reject)=>{
      this.http.get(this.url+type,httpOptions).subscribe((result)=>{
        resolve(result);
      },(err)=>{
        reject(err);
      })
    })
  }
  checklogin(token){
    sessionStorage.setItem('token',token);
    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'x-access-token':token
         })
    };
    return new Promise((resolve,reject)=>{
      this.http.post(this.url+"checkLogin","",httpOptions).subscribe((result)=>{
        resolve(result);
      },(err)=>{
        reject(err);
      })
    })
  }



}


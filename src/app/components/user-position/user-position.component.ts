import { Component, OnInit } from '@angular/core';
import {user_postion_lang} from "../../language/user_position";
import { ActivatedRoute, Router } from '@angular/router';
import { MyserviceService } from '../../provider/myservice.service';

import Swal from 'sweetalert2';
import OlMap from "ol/map";
import OlTileWMS from "ol/source/TileWMS";
import OlTileLayer from "ol/layer/tile";
import OlView from "ol/View";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature';
import Icon from 'ol/style/icon';
import Style from 'ol/style/Style';
import { Tooltip } from 'chart.js';
import Overlay from "ol/Overlay";
import { PopoverConfig } from 'ngx-bootstrap/popover';
declare var ol: any;
import * as $ from 'jquery';
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), {
    placement: 'right',
    container: 'body',
    triggers: 'focus'
  });
}
@Component({
  selector: 'app-user-position',
  templateUrl: './user-position.component.html',
  styleUrls: ['./user-position.component.scss'],
  providers: [{ provide: PopoverConfig, useFactory: getPopoverConfig }]
})
export class UserPositionComponent implements OnInit {
  //open layer
  map: OlMap;
  source: OlTileWMS;
  layer: OlTileLayer;
  view: OlView;
  markerSource: VectorSource
  users:any;
  all_user:any;
  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";
  language:any;
  isLoading=true;
  view_user={fee_option: "",flag: "",lastlogin: "",lat: "",lon: "",medical_option: "",param_option: "",password: "",role: "",street_light_option: "",user_id: "",user_name: "",user_surname: ""}

  action=0;
  constructor(private route: ActivatedRoute, private router: Router,private service:MyserviceService) { }

  ngOnInit() {
    this.refreshData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=user_postion_lang[this.lang];
      }else{
        this.language=user_postion_lang[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });

  }
  onSearchUser(event){

    console.log(event.target.value)
    this.users=this.all_user.filter((item)=>{
      return compare(item.user_id)||compare(item.user_name)||compare(item.user_surname);
    })
    function compare(type){
      if(type==null) return false;
      else
      return type.toLowerCase().indexOf(event.target.value.toLowerCase())>-1;
    }
  }
  refreshData(){

    this.action=0;
    this.service.postData({},"get_user").then((result:any)=>{
      console.log(result);
      this.users=result.filter(item=>{
        return item.lat&&item.lon
      }).map((item:any)=>{
        var date=new Date(item.lastlogin);
        item.lastlogin=this.formatDate(date);
        item.active=false;
        var date1=new Date().getTime();
        var login=new Date(item.lastlogin).getTime();
        if((date1-login)/1000<30*60){
          item.active=true;
        }
        return item;
      });
      this.all_user=this.users;
      this.isLoading=false;
      setTimeout(() => {

        this.source = new OlTileWMS({
          url: "https://www.deemap.com/DeeMap/gwc/service/wms?customer_key=1xwg5CAuhFz8z2Rw",
          params: {
            "LAYERS": localStorage.getItem("lang") == 'EN' ? "DeeMap2_THA_Map_EN" : "DeeMap2_THA_Map",
            "FORMAT": "image/png8",
            "VERSION": "1.1.1",
            "SRS": "EPSG:900913",
            "TILES": true,
          }
        });
        this.layer = new OlTileLayer({
          source: this.source
        });
        this.markerSource = new VectorSource({
          features: []
        });

        var vectorLayer = new VectorLayer({
          source: this.markerSource
        });

        this.view = new OlView({
          center: ol.proj.transform(
            [100.6037284, 13.6768896],
            "EPSG:4326",
            "EPSG:900913"
          ), // lon lat
          zoom: 10,
          projection: "EPSG:900913",
          minZoom: 5,
          maxZoom: 21
        }, 1000);

        this.map = new OlMap({
          target: "map",
          layers: [this.layer, vectorLayer],
          view: this.view
        });
        this.map.render();
        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            scale: 1,
            src: '/assets/img/marker.png',
            crossOrigin: "Anonymous",
          })
        })
        var markers=[]
        this.users.forEach((user)=>{
         var marker = new Overlay({
          position: ol.proj.fromLonLat([parseFloat(user.lon), parseFloat(user.lat)]),
          positioning: 'center-center',
          element: document.getElementById(user.user_id),
          stopEvent: false
        });
        this.map.addOverlay(marker);
      })


        var feature = this.markerSource.getFeatures()
        for (let i in feature) {
          this.markerSource.removeFeature(feature[i])
        }
      //  this.markerSource.addFeatures(markers);
      });
    }, err=>{
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
    if(day<10) day="0"+day;
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour=date.getHours();
    if(hour<10) hour="0"+hour;
    var min=date.getMinutes();
    if(min<10) min="0"+min;
    var sec=date.getSeconds();
    if(sec<10) sec="0"+sec;
    return day + ' ' + monthNames[monthIndex] + ' ' + year +" "+hour+":"+min+":"+sec;
  }
  view_map(user){
    this.view_user=user;
    this.action=1;
    console.log(user);
    setTimeout(() => {

      this.source = new OlTileWMS({
        url: "https://www.deemap.com/DeeMap/gwc/service/wms?customer_key=1xwg5CAuhFz8z2Rw",
        params: {
          "LAYERS": localStorage.getItem("lang") == 'EN' ? "DeeMap2_THA_Map_EN" : "DeeMap2_THA_Map",
          "FORMAT": "image/png8",
          "VERSION": "1.1.1",
          "SRS": "EPSG:900913",
          "TILES": true,
        }
      });
      this.layer = new OlTileLayer({
        source: this.source
      });
      this.markerSource = new VectorSource({
        features: []
      });

      var vectorLayer = new VectorLayer({
        source: this.markerSource
      });

      this.view = new OlView({
        center: ol.proj.transform(
          [parseFloat(user.lon), parseFloat(user.lat)],
          "EPSG:4326",
          "EPSG:900913"
        ), // lon lat
        zoom: 15,
        projection: "EPSG:900913",
        minZoom: 5,
        maxZoom: 21
      }, 1000);

      this.map = new OlMap({
        target: "map",
        layers: [this.layer, vectorLayer],
        view: this.view
      });
      this.map.render();
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          scale: 1,
          src: '/assets/img/marker.png',
          crossOrigin: "Anonymous",
        })
      })

      var markers=[]
      this.users.forEach((user)=>{
       var marker = new Overlay({
        position: ol.proj.fromLonLat([parseFloat(user.lon), parseFloat(user.lat)]),
        positioning: 'center-center',
        element: document.getElementById(user.user_id),
        stopEvent: false
      });
      this.map.addOverlay(marker);

    })


      var feature = this.markerSource.getFeatures()
      for (let i in feature) {
        this.markerSource.removeFeature(feature[i])
      }
    //  this.markerSource.addFeatures(markers);
    });
  }
  back(){
    this.refreshData();

  }
}

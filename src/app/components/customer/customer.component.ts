import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { MatDialog } from '@angular/material';
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
declare var ol: any;


import {cus_lange} from "../../language/customer";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  //open layer
  map: OlMap;
  source: OlTileWMS;
  layer: OlTileLayer;
  view: OlView;
  markerSource: VectorSource
  submitted=false;

  //language
  lang=localStorage.getItem('lang')=="EN"?"EN":"TH";

  language:any;
  //variable
  all_customer:any[];
  customers: any[];
  all_place:any[];
  places: any[];
  isLoading = true;
  max_place_id: any;
  search_text="";
  search_place="";
  view_place_customer = { customer_id: "", customer_name: "", mobile: "", email: "" };
  edit_customer = { customer_id: "", customer_name: "", mobile: "", email: "" };
  place_customer = { customer_id: "", place_id: "", place_description: "", place_number: "", tambol: "", amphur: "", province: "", postcode: "", remark: "", place_type_id: "", lat: "", lon: "" };
  actions=[
    {id:0,action_type:{TH:"เสดงรายการข้อมูลผู้เสียค่าธรรมเนียม",EN:"View customer data"},hostUrl:"get_all_customer"},
    {id:1,action_type:{TH:"เพิ่มข้อมูลผู้เสียค่าธรรมเนียม",EN:"Add customer data"},hostUrl:"add_customer"},
    {id:2,action_type:{TH:"แก้ไขข้อมูลผู้เสียค่าธรรมเนียม",EN:"Edit customer data"},hostUrl:"edit_customer"},
    {id:3,action_type:{TH:"เสดงรายการที่อยู่ของผู้เสียค่าธรรมเนียม",EN:"View customer place"},hostUrl:"get_customer_place"},
    {id:4,action_type:{TH:"เพิ่มข้อมูลที่อยู่ของผู้เสียค่าธรรมเนียม",EN:"Add customer place"},hostUrl:"add_customer_place"},
    {id:4,action_type:{TH:"แก้ไขข้อมูลที่อยู่ของผู้เสียค่าธรรมเนียม",EN:"Edit customer place"},hostUrl:"edit_customer_place"}
  ];
  action=this.actions[0];


  place_types: any;
  constructor(private service: MyserviceService, private chRef: ChangeDetectorRef, public dialog: MatDialog,private route: ActivatedRoute, private router: Router) {
    this.language=cus_lange[this.lang];
  }

  ngOnInit() {
    this.getCustomerData();
    this.route.queryParams.subscribe(params => {
      this.lang= params['lang'];
      if(this.lang!='EN'&&this.lang!='TH'){
        this.lang=localStorage.getItem('lang')=='EN'?'EN':'TH';
        this.language=cus_lange[this.lang];
      }else{
        this.language=cus_lange[this.lang];
        localStorage.setItem('lang',this.lang);
      }
   });
  }
  onSearchChange(event){
    this.customers=this.all_customer.filter((item)=>{
      return item.customer_id.toLowerCase().indexOf(this.search_text.toLowerCase())>-1 ||
      item.customer_name.toLowerCase().indexOf(this.search_text.toLowerCase())>-1||
      item.mobile.toLowerCase().indexOf(this.search_text.toLowerCase())>-1||
      item.email.toLowerCase().indexOf(this.search_text.toLowerCase())>-1
    })
  }
  onSearchPlace(event){
    console.log(this.search_place);
    this.places=this.all_place.filter((item)=>{
      return item.customer_id.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.place_id.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.place_description.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.place_number.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.tambol.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.amphur.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.province.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.postcode.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.remark.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      item.place_type_description.toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      (item.lat+"").toLowerCase().indexOf(this.search_place.toLowerCase())>-1||
      (item.lon+"").toLowerCase().indexOf(this.search_place.toLowerCase())>-1;
    })
  }
  getCustomerData() {
    this.search_text="";
    this.search_place="";
    this.places=this.all_place;
    this.submitted=false;
    this.isLoading=true;
    this.action=this.actions[0];
    this.edit_customer = { customer_id: "", customer_name: "", mobile: "", email: "" };
    this.view_place_customer = { customer_id: "", customer_name: "", mobile: "", email: "" };

    this.place_customer = { customer_id: "", place_id: "", place_description: "", place_number: "", tambol: "", amphur: "", province: "", postcode: "", remark: "", place_type_id: "", lat: "", lon: "" };
    this.service.postData({}, this.action.hostUrl)
      .then((data: any) => {
        if (data.hasErr) {
          Swal.fire(
            this.language.cant_load_data,
            this.language.alert_load,
            'error'
          )
        } else {
          this.all_customer=data.data;
          this.customers = data.data;
          this.isLoading = false;
        }
      },(err)=>{this.isLoading=false;
        Swal.fire(
          this.language.cant_load_data,
          this.language.no_internet_alert,
          'error'
        )
      });
  }

  add() {
    this.action=this.actions[1];
    this.isLoading=true;
    this.service.postData({}, "getmax_customer_id").then((result: any) => {
      this.isLoading=false;
      if (result.hasErr) {
        Swal.fire(
          this.language.cant_load_data,
          this.language.cant_save_data,
          'error'
        )
      } else {
        this.edit_customer.customer_id = result.max_id;

      }
    })
  }
  back() {
    this.getCustomerData();
  }
  edit(customer_data) {
    this.action=this.actions[2];
    this.edit_customer = JSON.parse(JSON.stringify(customer_data));
  }
  save_customer() {
    this.submitted=true;
    var { customer_id, customer_name, mobile, email } = this.edit_customer;
    console.log(this.edit_customer);

    if(!(customer_name==""||mobile==""||email==""||email.indexOf("@")==-1||email.indexOf('.com')==-1)){
      this.isLoading=true;
      this.service.postData(this.edit_customer, this.action.hostUrl).then(result => {
        this.isLoading=false;
        Swal.fire(
          this.language.saved,
          '',
          'success'
        ).then((result)=>{
         this.getCustomerData();
        })
      }, err => {
        Swal.fire(
          this.language.no_internet_alert,
          '',
          'error'
        )
      })
    }

  }
  delete_customer(customer_data) {
    Swal.fire({
      title: this.language.confirm_delete,
      text: this.language.warning_delete,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close_page
    }).then((result) => {
      if (result.value) {
        this.isLoading=true;
        this.service.postData({ customer_id: customer_data.customer_id }, "delete_customer").then((result) => {
          this.isLoading=false;
          Swal.fire(
            this.language.deleted,
            '',
            'success'
          ).then((result) => {
            this.getCustomerData();
          })
        }, err => {
          Swal.fire(
            this.language.cant_delete,
            this.language.no_internet_alert,
            'error'
          )
        })
      }
    })
  }
  view_place(customer_data) {

    this.view_place_customer = customer_data;
    this.place_customer.customer_id = customer_data.customer_id;
    this.refresh_customer_place();

  }
  refresh_customer_place() {
    this.action=this.actions[3];
    this.submitted=false;
    this.place_customer = { customer_id: this.place_customer.customer_id, place_id: "", place_description: "", place_number: "", tambol: "", amphur: "", province: "", postcode: "", remark: "", place_type_id: "", lat: "", lon: "" };
    this.isLoading=true;

    this.service.postData({ customer_id: this.view_place_customer.customer_id }, this.action.hostUrl).then((result: any) => {
      this.all_place=result;
      this.isLoading=false;
      this.places = result;
    })
  }
  add_place() {
    this.action=this.actions[4];
    this.isLoading=true;
    this.service.postData({ customer_id: this.view_place_customer.customer_id }, "getmax_customer_place_id").then((result: any) => {

      this.place_customer.place_id = result.max_id;
    })

    this.service.postData({}, "get_place_type").then((result: any) => {
      this.isLoading=false;
      this.place_types = result;
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
        this.map.on('click', (evt: any) => {
          var coordinate = ol.proj.transform(evt.coordinate, 'EPSG:900913', 'EPSG:4326');
          var coords = ol.proj.toLonLat(evt.coordinate);
          this.place_customer.lat = coords[1];
          this.place_customer.lon = coords[0];
          var iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              scale: 0.5,
              src: '/assets/img/marker.png',
              crossOrigin: "Anonymous",
            })
          })
          var iconFeature = new Feature({
            type: 'icon',
            geometry: new Point(evt.coordinate),
          });
         iconFeature.setStyle(iconStyle)
          var feature = this.markerSource.getFeatures()
          for (let i in feature) {
            this.markerSource.removeFeature(feature[i])
          }
          this.markerSource.addFeatures([iconFeature])
        })
      });
    }, err => {
      Swal.fire(
        this.language.cant_load_data,
        this.language.no_internet_alert,
        'error'
      )
    })

  }
  save_place() {
    console.log(this.place_customer);
    this.submitted=true;

    var { customer_id, place_id, place_description, place_number, tambol, amphur, province, postcode, remark, place_type_id, lat, lon }=this.place_customer;
    if(!( place_number== "" || tambol== "" || amphur== "" || province== "" || postcode=="" || place_type_id == "" || lat==""|| lon=="")){
      this.isLoading=true;
      this.service.postData(this.place_customer, this.action.hostUrl).then((result) => {
        this.isLoading=false;
        Swal.fire(
          this.language.saved,
          '',
          'success'
        ).then((result) => {
          this.place_customer = { customer_id: this.place_customer.customer_id, place_id: "", place_description: "", place_number: "", tambol: "", amphur: "", province: "", postcode: "", remark: "", place_type_id: "", lat: "", lon: "" };
          this.refresh_customer_place();
        })
      }, err => {
        Swal.fire(
          this.language.no_internet_alert,
          '',
          'error'
        )
      })
    }

  }
  edit_place(place) {
    this.place_customer = place;
    this.action=this.actions[5];
    this.isLoading=true;
    this.service.postData({}, "get_place_type").then((result: any) => {
      this.isLoading=false;
      this.place_types = result;
      setTimeout(() => {
        this.source = new OlTileWMS({
          url: "https://www.deemap.com/DeeMap/gwc/service/wms?customer_key=1xwg5CAuhFz8z2Rw",
          params: {
            "LAYERS": localStorage.getItem("lang") == 'th' ? "DeeMap2_THA_Map" : "DeeMap2_THA_Map_EN",
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
            [parseFloat(place.lon), parseFloat(place.lat)],
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
            anchor: [0.5, 1],
            scale: 0.5,
            src: '/assets/img/marker.png',
            crossOrigin: "Anonymous",
          })
        })
        var iconFeature = new Feature({
          type: 'icon',
          geometry: new Point(ol.proj.transform([place.lon, place.lat], 'EPSG:4326',
          'EPSG:3857'))
        });
       iconFeature.setStyle(iconStyle)
        var feature = this.markerSource.getFeatures()
        for (let i in feature) {
          this.markerSource.removeFeature(feature[i])
        }
        this.markerSource.addFeatures([iconFeature])

        this.map.on('click', (evt: any) => {
          var coordinate = ol.proj.transform(evt.coordinate, 'EPSG:900913', 'EPSG:4326');
          var coords = ol.proj.toLonLat(evt.coordinate);
          this.place_customer.lat = coords[1];
          this.place_customer.lon = coords[0];
          var iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              scale: 0.5,
              src: '/assets/img/marker.png',
              crossOrigin: "Anonymous",
            })
          })
          var iconFeature = new Feature({
            type: 'icon',
            geometry: new Point(evt.coordinate),
          });
         iconFeature.setStyle(iconStyle)
          var feature = this.markerSource.getFeatures()
          for (let i in feature) {
            this.markerSource.removeFeature(feature[i])
          }
          this.markerSource.addFeatures([iconFeature])
        })
      });
    }, err => {
      Swal.fire(
        this.language.cant_load_data,
        this.language.no_internet_alert,
        'error'
      )
    })


  }
  back_place() {

    this.refresh_customer_place();
  }

  delete_place(place) {
    Swal.fire({
      title: this.language.delete_place_alert,
      text: this.language.warning_delete,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.language.want_delete,
      cancelButtonText: this.language.close_page
    }).then((result) => {
      if (result.value) {
        console.log(place);
        this.isLoading=true;
        this.service.postData({ customer_id: place.customer_id, place_id: place.place_id }, "delete_customer_place").then((result) => {
          Swal.fire(
            this.language.deleted,
            '',
            'success'
          ).then((result) => {
            this.isLoading=false;
            this.refresh_customer_place();
          })
        }, err => {
          Swal.fire(
            this.language.cant_delete,
            this.language.no_internet_alert,
            'error'
          )
        })
      }
    })
  }
}

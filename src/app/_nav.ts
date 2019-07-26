interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems= {
  TH:[
    {
      name: 'หน้าสรุปข้อมูล',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: 'จัดการข้อมูลทั่วไป'
    },
    {
      name:"ข้อมูลผู้เสียค่าธรรมเนียม",
      url:"/customer",
      icon:"fas fa-user-friends"
    },{
      name:"ข้อมูลชนิดที่อยู่",
      url:"/place_type",
      icon:"fas fa-home"
    },{
      name:"ข้อมูลค่าธรรมเนียม",
      url:"/fee",
      icon:"fas fa-money-check-alt"
    },{
      name:"ข้อมูลชนิดค่าธรรมเนียม",
      url:"/fee_type",
      icon:"fas fa-dollar-sign"
    },{
      name:"ข้อมูลประเภทการชำระ",
      url:"/payment_type",
      icon:"fas fa-comments-dollar"
    },{
      name:"ข้อมูลการค้างชำระ",
      url:"/paybill",
      icon:"fas fa-scroll",
      badge: {
        variant: 'info',
        text: '0'
      }
    },{
      name:"ข้อมูลการชำระ",
      url:"/invoice",
      icon:"fas fa-money-check-alt",
      badge: {
        variant: 'info',
        text: '0'
      }
    },{
      name:"ตำแหน่งของพนักงาน",
      url:"/user_position",
      icon:"fas fa-map-marked"
    }
  ],
  EN:[
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: 'General data'
    },
    {
      name:"Customer Data",
      url:"/customer",
      icon:"fas fa-user-friends"
    },{
      name:"Place Type Data",
      url:"/place_type",
      icon:"fas fa-home"
    },{
      name:"Fee Data",
      url:"/fee",
      icon:"fas fa-money-check-alt"
    },{
      name:"Fee Type Data",
      url:"/fee_type",
      icon:"fas fa-dollar-sign"
    },{
      name:"Paymet Data",
      url:"/payment_type",
      icon:"fas fa-comments-dollar"
    },{
      name:"Pay Bill",
      url:"/paybill",
      icon:"fas fa-scroll"
    },{
      name:"Invoice",
      url:"/invoice",
      icon:"fas fa-money-check-alt"
    },{
      name:"User Position",
      url:"/user_position",
      icon:"fas fa-map-marked"
    }
]
}

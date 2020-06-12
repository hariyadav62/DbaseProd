import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component, ViewChild, OnInit, Input, Inject, Injectable } from '@angular/core';
import Chart from 'chart.js';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
@Component({
  selector: 'timechart',
  templateUrl: 'timechart.html',
  providers:[]
})
export class TimechartComponent implements OnInit {

  @ViewChild('Canvas') Canvas;
  @Input('dataset') dataset:any;
  @Input('Year') Year:any;

 empId:any;
 empName: any; 
 checkinpercentage: any; 
 monthReports:boolean = false;
  timingMonths: any;
  // _HOST2: string = "http://localhost:21249/api/dbaseapi"; 
  _HOST2 : string =	"http://app.dbasesolutions.in/api/dbaseapi";
  timingMonthData: any;
  Month:any;
  maxCheckins: any;
  totalCheckinPer: any;
  intimeCheckinPer: any;
  totcheckins: any;
  intimeins: any;
  activeCard: boolean=false;
  notimeins: any;
  notimeCheckinPer: string;
 
  constructor(public http: HttpClient,public loadingController: LoadingController) {
  } 
  barChart: any;
  ngOnInit() { 
    this.barChartMethod();  
  } 
  hideReports(){
    this.monthReports =!this.monthReports;
    this.activeCard =!this.activeCard;
  }
  showReports(){
    let loader = this.loadingController.create({
          content: "Loading.."
        }); 
        loader.present();
    this.activeCard =!this.activeCard;
    this.http
    .get(this._HOST2+ '/LoadEmpTimeMonths?empid='+this.empId+'&year='+this.Year+'&month=0')
    .subscribe((dataa : any) =>
    {  
      this.timingMonths = dataa;
      this.Month = this.timingMonths[0].DATE;
      //this.monthReports =!this.monthReports;
      this.http
      .get(this._HOST2+ '/LoadEmpTimeMonths?empid='+this.empId+'&year='+this.Year+'&month='+this.timingMonths[0].DATE)
      .subscribe((data : any) =>
      {  
        this.timingMonthData = data;
        loader.dismiss();
        this.monthReports =!this.monthReports;
      },
      (error : any) =>
      { 
        console.dir(error); 
        loader.dismiss();
      }); 
    },
    (error : any) =>
    { 
      console.dir(error); 
      loader.dismiss();
    });     
  }
  LoadTimingMonthData(){
    let loader = this.loadingController.create({ 
      content: "Loading.."
    }); 
    loader.present();
    this.activeCard =!this.activeCard;
    this.http
    .get(this._HOST2+ '/LoadEmpTimeMonths?empid='+this.empId+'&year='+this.Year+'&month='+this.Month)
    .subscribe((data : any) =>
    {  
      this.timingMonthData = data;
      loader.dismiss();
    },
    (error : any) =>
    { 
      console.dir(error); 
      loader.dismiss();
    });  
  }
  // LoadEmpTimingMonths(empid:string,year:any,month:any){
  //   // let loader = this.loadingController.create({
  //   //   content: "Loading.."
  //   // }); 
  //   // loader.present();

  //   let promise = new Promise((resolve,reject)=>{
  //     this.http
  //     .get(this._HOST2+ '/LoadEmpTimeMonths?empid='+empid+'&year='+year+'&month='+month)
  //     .subscribe((data : any) =>
  //     { 
  //     this.timingMonths = data;
  //       // loader.dismiss();
  //       console.log(this.barChart);
  //       resolve();
  //     },
  //     (error : any) =>
  //     { 
  //       console.dir(error); 
  //       // loader.dismiss();
  //     }); 
  //   });
  //   return promise;
  // }  
  barChartMethod() { 
    this.empId = this.dataset.EMPID;
    this.empName = this.dataset.EmpName;
    this.checkinpercentage = this.dataset.CHECKINPERCENTAGE.toFixed(2);
    this.maxCheckins = this.dataset.MAXCHECKINS;
    this.totcheckins = this.dataset.TOTALCHECKINS;
    this.intimeins = this.dataset.INTIMECHECKINS
    this.notimeins = this.dataset.NOTIME;
    this.totalCheckinPer = ((this.dataset.TOTALCHECKINS/this.maxCheckins)*100).toFixed(1);
    this.intimeCheckinPer = ((this.dataset.INTIMECHECKINS/this.maxCheckins)*100).toFixed(1);
    this.notimeCheckinPer = ((this.dataset.NOTIME/this.maxCheckins)*100).toFixed(1);
  //   this.barChart = new Chart(this.Canvas.nativeElement, {
  //     type: 'horizontalBar', 
  //     data: {
  //     labels: [''],
  //     datasets: [{
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //       hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
  //       hoverBorderColor: 'rgba(255, 99, 132, 0.9)',
  //       data: [this.dataset.TOTALCHECKINS ] 
  //     },
  //     {
  //       backgroundColor: 'rgba(255, 159, 64, 0.5)',
  //       hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)',
  //       hoverBorderColor: 'rgba(255, 159, 64, 0.9)',
  //       data: [this.dataset.INTIMECHECKINS]
  //     }
  //   ]
  // },
  //     options: {
  //       legend: {
  //           display: false
  //        },
  //       maintainAspectRatio: true,
  //       scales: {
  //         xAxes: [{
  //           stacked: true,
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }],
  //         yAxes: [{
  //           stacked: true,
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       }
  //     }
  //   });
  }
}

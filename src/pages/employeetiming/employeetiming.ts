import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import Chart from 'chart.js';
//import Chart from 'chart.js';

@Component({
  selector: 'page-employeetiming',
  templateUrl: 'employeetiming.html',
})
export class EmployeetimingPage { 
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  @ViewChild(Content) content: Content;
  public doughnutChartLabels:string[] = ['Total Checkins', 'Ontime Checkins'];
  public doughnutChartColor:string[] = ["#36A2EB","#FF6384"];
  public doughnutChartData:number[] ;
  public doughnutChartType:string = 'pie';
  public barChartOptions:any = {scaleShowVerticalLines: true,responsive: true };
  public barChartLabels:string[] = [' %'];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = false; 
  totalpie:any;
  pieChartData1:any[] = [];
  incheck: any=0;
  totcheck: any=0;
  Year: any;
  activeyear:any;
  doughnutChart: Chart;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
  } 

  async ionViewWillEnter(){
    await this.restCall.LoadHomeTimingChart().then(()=>{
      this.restCall.pieChart.forEach(el => { 
        this.pieChartData1.push([el.TOTALCHECKINS, el.INTIMECHECKINS, el.YEAR, el.CHECKINPERCENTAGE]); 
      }); 
    });
    this.doughnutChartData = [this.totcheck-this.incheck, this.incheck];
    this.yolo(this.totcheck,this.incheck); 
    this.Year= this.restCall.pieChart[0].YEAR;
    this.activeyear = this.restCall.pieChart[0].YEAR;
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      await this.restCall.LoadEmpTimingBarChart('All',this.activeyear,0).then(()=>{
        this.totcheck = this.restCall.barChart[0].TOTALCHECKINS;
        this.incheck = this.restCall.barChart[0].INTIMECHECKINS;
        this.totalpie = +((this.incheck/this.totcheck)*100).toFixed(2);
        this.yolo(this.totcheck,this.incheck); 
      });
    }else{
      await this.restCall.LoadEmpTimingBarChart(this.restCall.currentuser.EmpCode,this.activeyear,0).then(()=>{
        this.totcheck = this.restCall.barChart[0].TOTALCHECKINS;
        this.incheck = this.restCall.barChart[0].INTIMECHECKINS;
        this.totalpie = +((this.incheck/this.totcheck)*100).toFixed(2);
        this.yolo(this.totcheck,this.incheck); 
      });
    }
    
    await this.restCall.LoadEmpTimingBarChart('All',this.restCall.pieChart[0].YEAR,0);

  }
 
  async LoadEmpBars(year){
    this.Year= year;
    this.activeyear = year;
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      await this.restCall.LoadEmpTimingBarChart('All',this.activeyear,0).then((data:any)=>{
        this.totcheck = this.restCall.barChart[0].TOTALCHECKINS;
        this.incheck = this.restCall.barChart[0].INTIMECHECKINS;
        this.totalpie = +((this.incheck/this.totcheck)*100).toFixed(2);
        this.yolo(this.totcheck,this.incheck); 
      });
    }else{
      await this.restCall.LoadEmpTimingBarChart(this.restCall.currentuser.EmpCode,this.activeyear,0).then((data:any)=>{
        if(this.restCall.barChart.length != 0){
          this.totcheck = this.restCall.barChart[0].TOTALCHECKINS;
          this.incheck = this.restCall.barChart[0].INTIMECHECKINS;
          this.totalpie = +((this.incheck/this.totcheck)*100).toFixed(2);
        }else{
          this.totcheck = 0;
          this.incheck = 0;
          this.totalpie = 0; 
        }
        this.yolo(this.totcheck,this.incheck); 
        });
    await this.restCall.LoadEmpTimingBarChart('All',year,0);
  }
}
 yolo(totcheck,incheck){
   if(totcheck == 0){
    totcheck = 1;
   }
  this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    type: "pie",
    data: {
      labels: ["Latecheckins", "OntimeCheckin"],
      datasets: [
        {
          label: "Checkins",
          data: [totcheck-incheck, incheck],
          backgroundColor: [
            "rgba(255, 0, 0, 0.9)",
            "rgb(76, 195, 92)"
          ],
         // hoverBackgroundColor: ["#36A2EB", "#FF6384"]
        },
      ]
    },
    options:{
      legend: {
        display: true
      },
      responsive: true,
      maintainAspectRatio: true,
    }
  });
 }
 chartClicked(element:string) {
    this.content.resize();
    let yOffset = document.getElementById(this.restCall.currentuser.EmpCode).offsetTop;
    console.log(document.getElementById(this.restCall.currentuser.EmpCode));
    this.content.scrollTo(0, yOffset, 1000)
  }
}
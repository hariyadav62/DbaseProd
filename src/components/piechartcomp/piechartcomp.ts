import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'piechartcomp',
  templateUrl: 'piechartcomp.html'
})
export class PiechartcompComponent {

  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  @Input('piedataset') piedataset:any;

  checkinPercentage:any;
  year:any; 
  public doughnutChart: Chart;

  constructor() {
  }
  ngOnInit() {
    this.year = this.piedataset[2]; 
    this.checkinPercentage = this.piedataset[3]; 
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "pie",
      data: {
        labels: ["Latecheckins", "OntimeCheckin"],
        datasets: [
          {
            label: "Checkins",
            data: [this.piedataset[0]-this.piedataset[1],this.piedataset[1]],
            backgroundColor: [
              "rgba(255, 0, 0, 0.9)",
              "rgb(76, 195, 92)"
            ],
            //hoverBackgroundColor: ["#36A2EB", "#FF6384"]
          },
        ]
      },
      options:{
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });
  }
}
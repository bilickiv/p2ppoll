import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { AllCountryPage } from '../all-country/all-country';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';


/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})

export class StatisticsPage {

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;

  question: string;
  sum: number;
  doughnutChart: any;
  barChart: any;

  most: string;
  author: string;
  createDate: string;
  modifyDate: string;

  countriesArray = new Array();
  coValuesArray = new Array();
  allCountry = new Array();

  countryCard: any;
  countryIf: any;
  thirdLabel: string;
  canvasSizeHelper: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.countryIf = true;
  }

  ionViewWillEnter() {
    this.countryCheck();
    this.chartDraw();
  }

  countryCheck() {
    let country = localStorage.getItem('country');
    if (country == "Hidden") {
      this.countryCard = true;
    } else {
      this.countryCard = false;
    }
  }

  goSettings() {
    this.navCtrl.push(ProfileSettingsPage);
  }

  chartDraw() {
    let jsonArray = JSON.parse(localStorage.getItem('jsonArray'));
    this.question = jsonArray[1];
    this.author = jsonArray[8];
    this.createDate = jsonArray[10];
    this.modifyDate = jsonArray[11];
    this.thirdLabel = jsonArray[4];
    this.sum = jsonArray[5] + jsonArray[6] + jsonArray[7];

    if (jsonArray[6] >= jsonArray[5] && jsonArray[6] >= jsonArray[7]) {
      this.most = jsonArray[3];
    }
    if (jsonArray[7] >= jsonArray[5] && jsonArray[7] >= jsonArray[6]) {
      this.most = jsonArray[4];
    }
    if (jsonArray[5] >= jsonArray[6] && jsonArray[5] >= jsonArray[7]) {
      this.most = jsonArray[2];
    }

    if (this.thirdLabel == "") {
      this.thirdLabel = "Not used"
    }

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: [jsonArray[2], jsonArray[3], this.thirdLabel],
        datasets: [{
          data: [jsonArray[5], jsonArray[6], jsonArray[7]],
          backgroundColor: [
            'rgba(249, 166, 2, 0.8)',
            'rgba(5, 122, 255, 0.8)',
            'rgba(85, 26, 139, 0.8)',
          ],
          hoverBackgroundColor: [
            "#f9a602",
            "#057aff",
            "#551A8B"
          ]
        }]
      }
    });


    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Vote number',
          data: [],
          backgroundColor: [
            'rgba(255, 255, 0, 0.6)',
            'rgba(30,161,239,0.6)',
            'rgba(0, 240, 15, 0.6)',
            'rgba(80, 219, 149, 0.5)',
            'rgba(47, 47, 162, 0.5)',
            'rgba(255, 195, 0, 0.8)',
            'rgba(21, 79, 255, 0.8)',
            'rgba(88, 24, 69, 0.8)'
          ],
        }]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: ''
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: function (label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) {
                  return label;
                }
              }
            }
          }]
        }

      }
    });

    var i, j, tmp;
    j = 0;
    let helperString = "";
    for (i = 0; i < jsonArray[15].length; i++) {
      if (jsonArray[15][i] == ",") {
        this.countriesArray[j] = helperString;
        j++;
        helperString = "";
      } else {
        helperString = helperString + jsonArray[15][i];
      }
    }

    j = 0;
    helperString = "";
    for (i = 0; i < jsonArray[16].length; i++) {
      if (jsonArray[16][i] == ",") {
        this.coValuesArray[j] = helperString;
        j++;
        helperString = "";
      } else {
        helperString = helperString + jsonArray[16][i];
      }
    }

    for (i = 0; i < this.coValuesArray.length; i++) {  //Convert string to int
      this.coValuesArray[i] = +this.coValuesArray[i];
    }

    for (i = this.coValuesArray.length - 1; 0 < i; --i) { // Bubble sort
      for (j = 0; j < i; ++j) {
        if (this.coValuesArray[j] < this.coValuesArray[j + 1]) {
          tmp = this.countriesArray[j];
          this.countriesArray[j] = this.countriesArray[j + 1];
          this.countriesArray[j + 1] = tmp;

          tmp = this.coValuesArray[j];
          this.coValuesArray[j] = this.coValuesArray[j + 1];
          this.coValuesArray[j + 1] = tmp;
        }
      }
    }

    for (i = 0; i < 3; i++) {
      if (this.countriesArray[i] != null && this.countriesArray[i] != undefined) {
        this.barChart.data.datasets[0].data[i] = +this.coValuesArray[i];
        this.barChart.data.labels[i] = this.countriesArray[i];
        this.barChart.update();
      }
    }

    if (this.barChart.data.datasets[0].data[0] == "" || this.barChart.data.datasets[0].data[0] == undefined || this.barChart.data.datasets[0].data[0] == null) {
      this.countryIf = false;
    }
  }

  openAllCountryPage() {
    this.allCountry = [];
    if (this.countriesArray[0] != null && this.countriesArray[0] != undefined) {
      for (var i = 0; i < this.countriesArray.length; i++) {
        var jsonFile = {
          label: this.countriesArray[i], value: this.coValuesArray[i]
        }
        this.allCountry.push(jsonFile);
      }
      localStorage.setItem('allCountry', JSON.stringify(this.allCountry));
      this.navCtrl.push(AllCountryPage);
    }
  }

}

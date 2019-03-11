import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';

import { AllCountryPage } from '../all-country/all-country';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.countryIf = true;
  }


  ionViewWillEnter() {
    this.countryCheck();
    this.chartDraw();
  }

  countryCheck() {
    this.storage.get('country').then((country) => {
      if (country == "Hidden") {
        this.countryCard = true;
      } else {
        this.countryCard = false;
      }


    });
  }

  chartDraw() {
    this.storage.get('jsonArray').then((val) => {

      this.question = val[1];
      this.author = val[8];
      this.createDate = val[10];
      this.modifyDate = val[11];
      this.thirdLabel = val[4];

      this.sum = val[5] + val[6] + val[7];
      console.log(val[5]);

      if (val[6] >= val[5] && val[6] >= val[7]) {
        this.most = val[3];
      }
      if (val[7] >= val[5] && val[7] >= val[6]) {
        this.most = val[4];
      }
      if (val[5] >= val[6] && val[5] >= val[7]) {
        this.most = val[2];
      }

      if (this.thirdLabel == "") {
        this.thirdLabel = "Not used"
      }

      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: [val[2], val[3], this.thirdLabel],
          datasets: [{
            data: [val[5], val[6], val[7]],
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
    });

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Vote number',
          data: [],
          backgroundColor: [
            'rgba(17, 100, 102, 0.7)',
            'rgba(241, 90, 34, 0.7)',
            'rgba(128, 0, 0, 0.7)',
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
              userCallback: function(label, index, labels) {
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

    this.addChartData();

  }

  addChartData() {
    this.storage.get('finalCountries').then((countries) => {
      this.storage.get('finalCoValues').then((coValues) => {

        var i, j, tmp;
        j = 0;
        let helperString = "";
        for (i = 0; i < countries.length; i++) {
          if (countries[i] == ",") {
            this.countriesArray[j] = helperString;
            j++;
            helperString = "";
          } else {
            helperString = helperString + countries[i];
          }
        }

        j = 0;
        helperString = "";
        for (i = 0; i < coValues.length; i++) {
          if (coValues[i] == ",") {
            this.coValuesArray[j] = helperString;
            j++;
            helperString = "";
          } else {
            helperString = helperString + coValues[i];
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

      });
    });
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
      this.storage.set('allCountry', this.allCountry);
      this.navCtrl.push(AllCountryPage);
    }
  }

}

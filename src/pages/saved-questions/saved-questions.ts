import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import * as firebase from 'firebase';

import { AllCountryPage } from '../all-country/all-country';



/**
 * Generated class for the SavedQuestionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-questions',
  templateUrl: 'saved-questions.html',
})
export class SavedQuestionsPage implements AfterViewInit {

  @ViewChild('polarCanvas') polarCanvas: ElementRef;
  @ViewChild('barCanvas') barCanvas: ElementRef;

  polarChart: any;
  barChart: any;

  bar = true;
  polar = true;
  empty = true;

  actualIndex: number;
  nextButton: any;
  previousButton: any;

  items: any;
  question: string;

  firstLabel: string;
  secondLabel: string;
  thirdLabel: string;

  firstValue: number;
  secondValue: number;
  thirdValue: number;

  helper: any;
  savedQuestions: any;
  coreHelper: any;
  ref: any;
  corrTopicName: string;

  countries = new Array();
  coValues = new Array();
  allCountry = new Array();
  syncComplete = new Array();

  first: number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.bar = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedQuestionsPage');
  }

  next() {
    this.draw("next");
    if (this.previousButton == true) {
      this.previousButton = false;
    }
  }

  previous() {
    this.draw("previous");
    if (this.nextButton == true) {
      this.nextButton = false;
    }
  }

  ionViewWillEnter() {
    this.actualIndex = 0;
    this.previousButton = true;
    this.first = 0;
  }

  ngAfterViewInit() {
    this.draw("null");
  }

  draw(reason: string) {

    this.countries = [];
    this.coValues = [];
    this.allCountry = [];

    this.savedQuestions = JSON.parse(localStorage.getItem('savedQuestions'));

    this.items = this.savedQuestions;

    if (this.items != undefined && this.items.length != 0) {
      console.log("benn")
      console.log(this.items.length);
      if (this.items.length == 0) {
        this.polar = false;
        this.bar = false;
        this.nextButton = true;
      }

      if (this.items.length == 1) {
        this.nextButton = true;
        this.polar = true;
        this.bar = true;
        this.empty = false;
      }

      if (this.items.length > 1) {
        this.polar = true;
        this.bar = true;
        this.empty = false;
      }

      if (reason == "next") {
        ++this.actualIndex;
        console.log("actind", this.actualIndex);
        if (this.actualIndex == this.items.length - 1) {
          this.nextButton = true; //disable <- true
        }
      }
      if (reason == "previous") {
        --this.actualIndex;
        if (this.actualIndex == 0) {
          this.previousButton = true;
        }
      }
      if (reason == "null") {
        this.actualIndex = 0;
      }

      if (reason == "actual") { }

      if (this.items[this.actualIndex] != undefined && this.items[this.actualIndex] != null || this.items.length < this.actualIndex) {
        this.helper = this.items[this.actualIndex];
        this.question = this.helper.question;
        this.firstLabel = this.helper.firstAnswer;
        this.secondLabel = this.helper.secondAnswer;
        this.thirdLabel = this.helper.thirdAnswer;

        this.firstValue = this.helper.firstValue;
        this.secondValue = this.helper.secondValue;
        this.thirdValue = this.helper.thirdValue;

        this.helper = this.items[this.actualIndex];

        if (this.thirdLabel == "") {
          this.thirdLabel = "Not used"
        }

        this.polarChart = new Chart(this.polarCanvas.nativeElement, {

          type: 'polarArea',
          data: {
            labels: [this.firstLabel, this.secondLabel, this.thirdLabel],
            datasets: [{
              label: '# of Votes',
              data: [this.firstValue, this.secondValue, this.thirdValue],
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
              label: '',
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

      } else {
        console.log('else')
        //this.nextButton = false;
      }
      this.updateQuestion(this.actualIndex);
    }else {
      this.polar = false;
      this.bar = false;
      this.nextButton = true;
    }

  }

  openAllCountryPage() {
    this.allCountry = [];
    if (this.countries[0] != null && this.countries[0] != undefined) {
      for (var i = 0; i < this.countries.length; i++) {
        var jsonFile = {
          label: this.countries[i], value: this.coValues[i]
        }
        this.allCountry.push(jsonFile);
      }
      localStorage.setItem('allCountry', JSON.stringify(this.allCountry));
      this.navCtrl.push(AllCountryPage);
    }
  }

  updateQuestion(index: number) {
    this.savedQuestions = JSON.parse(localStorage.getItem('savedQuestion'));


    this.corrTopicName = 'topics/' + this.helper.catOne + '/' + this.helper.key + '/';
    console.log("corrtopname: ", this.corrTopicName);

    this.updatePolarChart(this.helper);
    this.updateBarChart(this.helper);

    if (this.barChart.data.datasets[0].data[0] == "" || this.barChart.data.datasets[0].data[0] == undefined || this.barChart.data.datasets[0].data[0] == null) {
      this.bar = false;
    }

    this.ref = firebase.database().ref(this.corrTopicName);  // async

    this.ref
      .once('value')
      .then(res => {
        this.coreHelper = res.val();
        this.helper.firstValue = this.coreHelper.firstValue;
        this.helper.secondValue = this.coreHelper.secondValue;
        this.helper.thirdValue = this.coreHelper.thirdValue;
        this.helper.countries = this.coreHelper.countries;
        this.helper.coValues = this.coreHelper.coValues;
        this.savedQuestions = JSON.parse(localStorage.getItem('savedQuestions'));
        this.savedQuestions[index] = this.helper;
        localStorage.setItem('savedQuestions', JSON.stringify(this.savedQuestions));
        this.updatePolarChart(this.helper);
        this.updateBarChart(this.helper);
      }).catch(err => {
        console.log('websocket');
      });

  }

  updatePolarChart(helper: any) {
    this.polarChart.data.datasets[0].data[0] = +helper.firstValue;
    this.polarChart.data.datasets[0].data[1] = +helper.secondValue;
    this.polarChart.data.datasets[0].data[2] = +helper.thirdValue;
    this.polarChart.update();
  }

  updateBarChart(helper: any) {
    this.question = helper.question;
    this.firstLabel = helper.firstAnswer;
    this.secondLabel = helper.secondAnswer;
    this.thirdLabel = helper.thirdAnswer;

    this.firstValue = helper.firstValue;
    this.secondValue = helper.secondValue;
    this.thirdValue = helper.thirdValue;

    if (helper.countries.length != 0) {

      //String operations 

      var i, j, tmp;
      j = 0;
      let helperString = "";
      for (i = 0; i < helper.countries.length; i++) {
        if (helper.countries[i] == ",") {
          this.countries[j] = helperString;
          j++;
          helperString = "";
        } else {
          helperString = helperString + helper.countries[i];
        }
      }

      j = 0;
      helperString = "";
      for (i = 0; i < helper.coValues.length; i++) {
        if (helper.coValues[i] == ",") {
          this.coValues[j] = helperString;
          j++;
          helperString = "";
        } else {
          helperString = helperString + helper.coValues[i];
        }
      }

      for (i = 0; i < this.coValues.length; i++) {  //Convert string to int
        this.coValues[i] = +this.coValues[i];
      }

      for (i = this.coValues.length - 1; 0 < i; --i) {
        for (j = 0; j < i; ++j) {
          if (this.coValues[j] < this.coValues[j + 1]) {

            tmp = this.countries[j];
            this.countries[j] = this.countries[j + 1];
            this.countries[j + 1] = tmp;

            tmp = this.coValues[j];
            this.coValues[j] = this.coValues[j + 1];
            this.coValues[j + 1] = tmp;

          }
        }
      }

      for (i = 0; i < 3; i++) {
        if (this.countries[i] != null && this.countries[i] != undefined && this.countries[i] != "hidden") {
          this.barChart.data.datasets[0].data[i] = +this.coValues[i];
          this.barChart.data.labels[i] = this.countries[i];
          this.barChart.update();
        }
      }

    }
  }

  delete() {
    this.showAlert();
  }


  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Delete',
      subTitle: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {
            this.savedQuestions = JSON.parse(localStorage.getItem('savedQuestions'));

            if (this.savedQuestions.length != 0) {

              if (this.actualIndex > -1) {  //Delete
                this.savedQuestions.splice(this.actualIndex, 1);
              }

              localStorage.setItem('savedQuestions', JSON.stringify(this.savedQuestions));

              if (this.savedQuestions.length == 0) {
                this.polar = false;
                this.bar = false;
                this.previousButton = true;
                this.nextButton = true;
                this.empty = true;
              }

              if (this.savedQuestions.length == 1) {
                this.draw("null");
                this.previousButton = true;
                this.nextButton = true;
              }

              this.savedQuestions = JSON.parse(localStorage.getItem('savedQuestions'));  

              if (this.savedQuestions.length > 1) {
                this.draw("null");
                this.previousButton = true;
                this.nextButton = false;
              }

            }
          }
        }
      ]
    });
    alert.present();
  }


}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { StatisticsPage } from '../statistics/statistics';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';


/**
 * Generated class for the QuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {

  //Date components
  actualDate: string;
  year: number;
  month: any;
  day: any;

  //Radio
  first: any;
  second: any;
  third: any;

  //Value
  firstValue: number;
  secondValue: number;
  thirdValue: number;

  //String fields
  question: string;
  firstAnswer: string;
  secondAnswer: string;
  thirdAnswer: string;
  author: string;
  reportValue: number;

  //Vote lock
  lock: boolean;
  votePermission: boolean;
  savePermission: boolean;
  thirdOption: boolean;

  create: string;
  modified: string;
  catOne: string;
  catTwo: string;
  catThree: string;

  key: any;

  countries: any;
  coValues: any;
  countriesArray = new Array();
  coValuesArray = new Array();
  myCountry: string;
  newCountry: boolean;
  matchedIndex: number;
  coNumber: number;
  finalCountries: string;
  finalCoValues: string;

  answer: string;
  ref: any;
  items: any;
  helper: any;
  corrTopicName: string;
  voteValue: number;
  votedQuestionIds: any;
  myVoteValue: number;
  topicName: string;
  jsonArray = new Array();
  savedQuestionsIdArray = new Array();
  savedQuestions = new Array();
  id: any;
  nickName: string;
  report: any;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.questionSetter();
    this.getDataFromDatabase();
    this.dateSetter();
    this.nickNameSetter();
  }

  nickNameSetter() {
    this.storage.get('nickName').then((val) => {
      this.nickName = val;
    });
  }

  getDataFromDatabase() {
    this.lock = true; // vote permission check
    this.votePermission = true;
    this.storage.get('votedQuestionIds').then((votedQuestionIds) => {
      this.votedQuestionIds = votedQuestionIds;
      if (votedQuestionIds != null) {
        for (var i = 0; i < votedQuestionIds.length; i++) {
          if (votedQuestionIds[i] == this.id) {
            this.votePermission = false;
            this.lock = false;
            if (this.votedQuestionIds.length > 5000) {
              this.votedQuestionIds = [];
              var j = 0;
              for (i = 2500; i <= 5000; i++) {
                this.votedQuestionIds[j] = votedQuestionIds[i];
                j++;
              }
              this.storage.set('votedQuestionIds', this.votedQuestionIds);
            }
          }
        }
      }
    });
    this.storage.get('topic').then((topicName) => {
      this.topicName = topicName;
    });
    this.storage.get('country').then((myCountry) => {
      this.myCountry = myCountry;
    })
  }

  openStatisticsPage() {
    if (!this.lock) {
      this.navCtrl.push(StatisticsPage);
    } else {
      this.showAlert('vote');
    }
  }

  questionSetter() {
    this.first = document.getElementById('first');
    this.first = true;
    this.second = document.getElementById('second');
    this.third = document.getElementById('third');

    this.storage.get('jsonArray').then((val) => {
      this.jsonArray = val;
      this.id = val[0];
      this.question = val[1];
      this.firstAnswer = val[2];
      this.secondAnswer = val[3];
      this.thirdAnswer = val[4];
      this.firstValue = val[5];
      this.secondValue = val[6];
      this.thirdValue = val[7];
      this.author = val[8];
      this.reportValue = val[9];
      this.create = val[10];
      this.modified = val[11];
      this.catOne = val[12];
      this.catTwo = val[13];
      this.catThree = val[14];
      this.countries = val[15];
      this.coValues = val[16];
      this.key = val[17];

      if (this.thirdAnswer == "" || this.thirdValue == undefined || this.thirdValue == null) {
        this.thirdOption = false;
      } else {
        this.thirdOption = true;
      }

      this.storage.set('finalCountries', this.countries);
      this.storage.set('finalCoValues', this.coValues);

    });
  }

  dateSetter() {
    let date: Date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    if (this.day < 10) {
      this.day = '0' + this.day;
    }
    this.actualDate = this.day + '.' + this.month + '.' + this.year;
  }


  /*
  * This method call voteTopic method and save guestion ID.
  */

  voting() {
    if (this.votePermission && this.nickName != "Anonym") {
      this.lock = false;
      if (this.first) {
        this.firstValue++;
        this.answer = "first";
        this.jsonArray[5] = this.firstValue;
      } else if (this.second) {
        this.secondValue++;
        this.answer = "second";
        this.jsonArray[6] = this.secondValue;
      } else if (this.third) {
        this.thirdValue++;
        this.answer = "third";
        this.jsonArray[7] = this.thirdValue;
      }

      this.voteTopic(this.catOne, this.answer, "one");

      this.jsonArray[11] = this.actualDate;
      this.votedQuestionIds.push(this.id);
      this.storage.set('votedQuestionIds', this.votedQuestionIds);
      this.storage.set('jsonArray', this.jsonArray);
      this.storage.get('voteNumber').then((val) => {
        this.myVoteValue = val;
        this.myVoteValue++;
        this.storage.set('voteNumber', this.myVoteValue);
      });
      this.openStatisticsPage();
    } else {
      this.showAlert("vote denied");
    }
  }


  /*
  * This method set values on firebase. The end character in firebase record(countries, coValues): , 
  */

  voteTopic(categorie: string, answer: string, actual: string) {
    this.corrTopicName = categorie + '/';
    this.ref = firebase.database().ref(this.corrTopicName);

    this.ref
      .once('value')
      .then(res => {
        this.items = convertArray(res);
        for (let prop in this.items) {
          this.helper = this.items[prop];
          if (this.helper.id == this.id) {
            switch (answer) {
              case "first": this.voteValue = this.helper.firstValue;
                this.voteValue++;
                firebase.database().ref(this.corrTopicName + this.helper.key).update({ firstValue: this.voteValue });
                break;
              case "second": this.voteValue = this.helper.secondValue;
                this.voteValue++;
                firebase.database().ref(this.corrTopicName + this.helper.key).update({ secondValue: this.voteValue });
                break;
              case "third": this.voteValue = this.helper.thirdValue;
                this.voteValue++;
                firebase.database().ref(this.corrTopicName + this.helper.key).update({ thirdValue: this.voteValue });
                break;
            }

            this.newCountry = true;
            let firebaseCountries = this.helper.countries;
            let firebaseCoValues = this.helper.coValues;
            let j = 0;
            let helperString = "";
            for (var i = 0; i < firebaseCountries.length; i++) {
              if (firebaseCountries[i] == ",") {
                this.countriesArray[j] = helperString;
                if (this.countriesArray[j] == this.myCountry) {
                  this.newCountry = false; // match
                  this.matchedIndex = j;
                }
                helperString = "";
                j++;
              } else {
                helperString = helperString + firebaseCountries[i];
              }
            }

            j = 0;
            helperString = "";
            for (i = 0; i < firebaseCoValues.length; i++) {
              if (firebaseCoValues[i] == ",") {
                if (this.newCountry == false && j == this.matchedIndex) {
                  this.coNumber = +helperString; 
                  this.coNumber++;
                  this.coValuesArray[j] = this.coNumber.toString();
                } else {
                  this.coValuesArray[j] = helperString;
                  j++;
                  helperString = "";
                }
              } else {
                helperString = helperString + firebaseCoValues[i];
              }
            }

            this.finalCoValues = "";
            this.finalCountries = "";

            for (i = 0; i < this.countriesArray.length; i++) {
              this.finalCountries = this.finalCountries + this.countriesArray[i] + ",";
              this.finalCoValues = this.finalCoValues + this.coValuesArray[i] + ",";
            }

            if (this.newCountry == true) {
              this.finalCountries = this.finalCountries + this.myCountry + ",";
              this.finalCoValues = this.finalCoValues + "1" + ",";
            }

            firebase.database().ref(this.corrTopicName + this.helper.key).update({ modified: this.actualDate });
            if (this.myCountry != "Hidden") {
              firebase.database().ref(this.corrTopicName + this.helper.key).update({ countries: this.finalCountries });
              firebase.database().ref(this.corrTopicName + this.helper.key).update({ coValues: this.finalCoValues });
            }

            this.storage.set('finalCountries', this.finalCountries);
            this.storage.set('finalCoValues', this.finalCoValues);

            //Async!!, it's important to be here. Reason -> firebase
            if (actual == "one") {
              if (this.catTwo != "" && this.catTwo != null && this.catTwo != undefined) {
                this.voteTopic(this.catTwo, this.answer, "two");
              }
            }

            //Async!!, it's important to be here. Reason -> firebase
            if(actual == "two"){
              if (this.catThree != "" && this.catThree != null && this.catThree != undefined) {
                this.voteTopic(this.catThree, this.answer, "three");
              }
            }

          }
        }
      }).catch(err => {
        console.log(err);
      });
  }

  save() {
    this.savePermission = true;
    this.storage.get('savedQuestions').then((val) => {
      if (val != null && val != undefined && val.length != 0) {
        for (var i = 0; i < val.length; i++) {
          if (val[i].id == this.id) {
            this.savePermission = false;
          }
        }
      }
      if (val.length < 30) {
        if (this.savePermission) {

          var jsonFile = {
            id: this.id, question: this.question, firstAnswer: this.firstAnswer, secondAnswer: this.secondAnswer,
            thirdAnswer: this.thirdAnswer, firstValue: this.firstValue, secondValue: this.secondValue, thirdValue: this.thirdValue,
            author: this.author, report: this.reportValue, create: this.create, modified: this.actualDate, catOne: this.catOne,
            catTwo: this.catTwo, catThree: this.catThree, countries: this.countries, coValues: this.coValues, key: this.key
          }

          this.storage.get('savedQuestions').then((val) => {
            this.savedQuestions = val;
            this.savedQuestions.push(jsonFile);
            this.storage.set('savedQuestions', this.savedQuestions);
          });
          this.showAlert("save question");
        } else {
          this.showAlert("already saved");
        }
      } else {
        this.showAlert("limit");
      }
    });
  }

  reportQuestion() {
    this.showAlert('report');
  }

  cancel() {
    this.navCtrl.pop();
  }

  radio(name: string) {
    if (name == 'first') {
      this.first = true;
      this.second = false;
      this.third = false;
    }
    if (name == 'second') {
      this.second = true;
      this.first = false;
      this.third = false;
    }
    if (name == 'third') {
      this.third = true;
      this.first = false;
      this.second = false;
    }
  }

  showAlert(name: string) {
    if (name == 'vote') {
      const alert = this.alertCtrl.create({
        title: 'Vote',
        subTitle: 'You have to Vote!',
        buttons: ['OK']
      });
      alert.present();
    }
    if (name == 'report') {
      const alert = this.alertCtrl.create({
        title: 'Report this question',
        subTitle: 'Are you sure?',
        buttons: [
          {
            text: 'No',
            role: 'no',
            handler: () => { }
          },
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
              this.showAlert('sure');
            }
          },
        ]
      });
      alert.present();
    }
    if (name == 'sure') {
      const alert = this.alertCtrl.create({
        title: 'Report this question',
        subTitle: 'Report this question...',
        buttons: [
          {
            text: 'No',
            role: 'no',
            handler: () => { }
          },
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
              this.corrTopicName = this.topicName + '/';
              this.ref = firebase.database().ref(this.corrTopicName);

              this.ref
                .once('value')
                .then(res => {
                  this.items = convertArray(res);
                  for (let prop in this.items) {
                    this.helper = this.items[prop];
                    if (this.helper.id == this.id) {
                      this.reportValue = this.helper.report;
                      firebase.database().ref(this.topicName + '/' + this.helper.key).update({ report: this.reportValue + 1 });
                    }
                  }
                });
            }
          },
        ]
      });
      alert.present();
    }
    if (name == 'vote denied') {
      const alert = this.alertCtrl.create({
        title: 'Vote',
        subTitle: 'You have Anonym person!',
        buttons: [
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
            }
          },
        ]
      });
      alert.present();
    }
    if (name == 'save question') {
      const alert = this.alertCtrl.create({
        title: 'Save',
        subTitle: 'Complete!',
        buttons: [
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
            }
          },
        ]
      });
      alert.present();
    }
    if (name == 'already saved') {
      const alert = this.alertCtrl.create({
        title: 'Save',
        subTitle: 'Already saved!',
        buttons: [
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
            }
          },
        ]
      });
      alert.present();
    }

    if (name == 'limit') {
      const alert = this.alertCtrl.create({
        title: 'Save',
        subTitle: 'You have reached the save limit!',
        buttons: [
          {
            text: 'Yes',
            role: 'yes',
            handler: () => {
            }
          },
        ]
      });
      alert.present();
    }

  }
}

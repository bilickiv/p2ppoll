import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { QuestionCategorieChoosePage } from '../question-categorie-choose/question-categorie-choose';
import { TabsPage } from '../tabs/tabs';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { convertArray } from '../../app/envrionment';

/**
 * Generated class for the NewQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-question',
  templateUrl: 'new-question.html',
})
export class NewQuestionPage {

  uniqueId: any;
  question: string;
  firstAnswer: string;
  secondAnswer: string;
  thirdAnswer: string;

  catOne: string;
  catTwo: string;
  catThree: string;
  nickName: string;
  corrCatName: string;
  chooseCategories: any;

  ref: any;

  year: number;
  month: any;
  day: any;
  hour: any;
  minute: any;
  actualDate: any;

  limits = new Array();
  limitDay;
  limitMonth;
  limitYear;
  limitNumber;
  questionNumber: number;

  myQuestions = new Array();
  countries: string;
  create: any;
  reportValue: number;
  author: string;
  id: any;
  firstValue: number;
  secondValue: number;
  coValues: string;
  thirdValue: number;
  uploadDate: string;
  news: any;
  helper: any;
  actualTopicValue: number;
  questionHelper: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.storage.set('catOne', null);
    this.storage.set('catTwo', null);
    this.storage.set('catThree', null);
    this.limitNumber = 1;
  }

  ionViewWillEnter() {
    this.catSetter();
    this.dateSetter();
    this.nickNameSetter();
    this.limitSetter();
    console.log("ionViewWillEnter");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewQuestionPage');
  }

  openCategorieChoose() {
    this.navCtrl.push(QuestionCategorieChoosePage);
  }

  idGenerator() {
    var number = Math.random();
    var id = number.toString(36).substr(2, 9);
    console.log("id: " + id);
    this.uniqueId = id;
  }

  catSetter() {
    this.storage.get('catOne').then((val) => {
      this.catOne = val;
      this.storage.get('catTwo').then((val) => {
        this.catTwo = val;
        this.storage.get('catThree').then((val) => {
          this.catThree = val;
          this.chooseCategories = this.catOne + ", " + this.catTwo + ", " + this.catThree;
          console.log(this.chooseCategories);
          if (this.catOne == null) {
            this.chooseCategories = "";
          } else if (this.catTwo == null) {
            this.chooseCategories = this.catOne;
          } else if (this.catThree == null) {
            this.chooseCategories = this.catOne + ", " + this.catTwo;
          }
        });
      });
    });
  }

  nickNameSetter() {
    this.storage.get('nickName').then((val) => {
      this.nickName = val;
    });
  }


  send() { //  question, ( first, second, three )x2, author, report, datex

    if (this.question != null && this.firstAnswer != null && this.secondAnswer != null && this.catOne != null && this.nickName != "Anonym") {
      this.question = this.question.replace(/\?/g, "");
      if (this.question.match(/^[A-Za-z0-9\s-\,]+$/) && this.question.length >= 3) {
        if (this.firstAnswer != this.secondAnswer && this.secondAnswer != this.thirdAnswer && this.firstAnswer != this.thirdAnswer) {
          if (this.limitNumber < 4) {
            this.idGenerator();

            if (this.thirdAnswer == null) {
              this.thirdAnswer = "";
            }

            if (this.catTwo == null) {
              this.catTwo = "";
            }

            if (this.catThree == null) {
              this.catThree = "";
            }

            if (this.question[0].match(/^[A-Za-z]+$/)) {
              this.questionHelper = this.question.charAt(0).toUpperCase() + this.question.slice(1);

              this.question = this.questionHelper;
            }

            var jsonFile = {
              id: this.uniqueId, question: this.question, firstAnswer: this.firstAnswer, secondAnswer: this.secondAnswer,
              thirdAnswer: this.thirdAnswer, firstValue: 0, secondValue: 0, thirdValue: 0, report: 0, author: this.nickName,
              create: this.actualDate, modified: this.actualDate, catOne: this.catOne, catTwo: this.catTwo, catThree: this.catThree,
              countries: "", coValues: ""
            };

            //var data = JSON.stringify(jsonFile);

            this.corrCatName = "news/" + this.catOne;
            firebase.database().ref(this.corrCatName).update({ id: this.uniqueId });
            firebase.database().ref(this.corrCatName).update({ uploadDate: this.uploadDate });
            this.catOne = this.catOne;
            this.ref = firebase.database().ref(this.catOne + '/');
            let newItem = this.ref.push();
            newItem.set(jsonFile);
            if (this.catTwo != "") {
              this.corrCatName = "news/" + this.catTwo;
              firebase.database().ref(this.corrCatName).update({ id: this.uniqueId });
              firebase.database().ref(this.corrCatName).update({ uploadDate: this.uploadDate });
              this.catTwo = this.catTwo;
              this.ref = firebase.database().ref(this.catTwo + '/');
              let newItem = this.ref.push();
              newItem.set(jsonFile);
              if (this.catThree != "") {
                this.corrCatName = "news/" + this.catThree;
                firebase.database().ref(this.corrCatName).update({ id: this.uniqueId });
                firebase.database().ref(this.corrCatName).update({ uploadDate: this.uploadDate });
                this.catThree = this.catThree;
                this.ref = firebase.database().ref(this.catThree + '/');
                let newItem = this.ref.push();
                newItem.set(jsonFile);
              }
            }

            this.limits[0] = this.year; // 2 question one day
            this.limits[1] = this.month;
            this.limits[2] = this.day;
            this.limitNumber++;
            this.limits[3] = this.limitNumber;

            this.storage.set('limit', this.limits);
            this.storage.set('catOne', null);
            this.storage.set('catTwo', null);
            this.storage.set('catThree', null);

            this.ref = firebase.database().ref('news/');
            this.ref
              .once('value')
              .then(res => {
                this.news = convertArray(res);
                for (let prop in this.news) {
                  this.helper = this.news[prop];
                  if (this.helper.topic == this.catOne) {
                    this.actualTopicValue = +this.helper.topics;
                    this.actualTopicValue++;
                    firebase.database().ref("news/" + this.catOne).update({ topics: this.actualTopicValue });
                  }
                  if (this.helper.topic == this.catTwo) {
                    this.actualTopicValue = +this.helper.topics;
                    this.actualTopicValue++;
                    firebase.database().ref("news/" + this.catTwo).update({ topics: this.actualTopicValue });
                  }
                  if (this.helper.topic == this.catThree) {
                    this.actualTopicValue = +this.helper.topics;
                    this.actualTopicValue++;
                    firebase.database().ref("news/" + this.catThree).update({ topics: this.actualTopicValue });
                  }
                }
              });

            this.storage.get('questionNumber').then((val) => {
              this.questionNumber = val;
              this.questionNumber++;
              this.storage.set('questionNumber', this.questionNumber);
            });

            jsonFile = {
              id: this.uniqueId, question: this.question, firstAnswer: this.firstAnswer, secondAnswer: this.secondAnswer,
              thirdAnswer: this.thirdAnswer, firstValue: this.firstValue, secondValue: this.secondValue, thirdValue: this.thirdValue,
              author: this.author, report: this.reportValue, create: this.create, modified: this.actualDate, catOne: this.catOne,
              catTwo: this.catTwo, catThree: this.catThree, countries: this.countries, coValues: this.coValues
            }

            this.storage.get('myQuestions').then((val) => {
              this.myQuestions = val;
              this.myQuestions.push(jsonFile);
              this.storage.set('myQuestions', this.myQuestions);
            });

            this.navCtrl.setRoot(TabsPage);
          } else {
            this.showAlert("limit");
          }
        } else {
          this.showAlert("same");
        }
      } else {
        this.showAlert("alphabet");
      }
    } else {
      this.showAlert("missing");
    }

  }

  dateSetter() {
    let date: Date = new Date();
    console.log("Date = " + date);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
    this.hour = date.getHours();
    this.minute = date.getMinutes();
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    if (this.day < 10) {
      this.day = '0' + this.day;
    }
    if (this.minute < 10) {
      this.minute = '0' + this.minute;
    }
    if (this.hour < 10) {
      this.hour = '0' + this.hour;
    }
    this.actualDate = this.day + '.' + this.month + '.' + this.year;
    this.uploadDate = this.day + '.' + this.month + '.' + this.year + "." + this.hour + "." + this.minute;
    console.log('actualDate: ' + this.actualDate);
  }

  limitSetter() {
    this.storage.get('limit').then((limit) => {
      this.limits = limit;
      if (this.limits[0] == this.year) {
        if (this.limits[1] == this.month) {
          if (this.limits[2] == this.day) {
            this.limitNumber = +this.limits[3];
          } else {
            this.limitNumber = 1;
            this.limits[3] = 1;
            this.storage.set('limit', this.limits);
          }
        } else {
          this.limitNumber = 1;
          this.limits[3] = 1;
          this.storage.set('limit', this.limits);
        }
      } else {
        this.limitNumber = 1;
        this.limits[3] = 1;
        this.storage.set('limit', this.limits);
      }
    });

  }

  showAlert(reason: string) {
    if (reason == "missing") {
      const alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: 'Missing data(s) or Anonym person!',
        buttons: ['OK']
      });
      alert.present();
    }
    if (reason == "limit") {
      const alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: 'You\'ve reached your sending limit!',
        buttons: ['OK']
      });
      alert.present();
    }
    if (reason == "same") {
      const alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: 'Same answers!',
        buttons: ['OK']
      });
      alert.present();
    }
    if (reason == "alphabet") {
      const alert = this.alertCtrl.create({
        title: 'Attention',
        subTitle: 'Please use alphabet characters, and: \' \', \'-\', \',\'!',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}

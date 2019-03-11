import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NewQuestionPage } from '../new-question/new-question';
import { QuestionListPage } from '../question-list/question-list';

import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';

/**
 * Generated class for the HotThemesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hot-themes',
  templateUrl: 'hot-themes.html',
})
export class HotThemesPage {

  nickName: string;
  topics = new Array();
  news: any;
  readedTopics: any;

  public topicNameArray = new Array();
  public topicTimeArray = new Array();
  public dailyTopicsHours = new Array();
  public plusTopics = new Array();
  ref: any;

  year = new Array();
  month = new Array();
  day = new Array();
  hour = new Array();
  minute = new Array();

  helperString: string;

  actualDay: any;
  topicsHelper = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HotThemesPage');
  }

  ionViewWillEnter() {
    this.storage.get('nickName').then((val) => {
      this.nickName = val;
    });
    this.topicsHelper = [];
    this.topicNameArray = [];
    this.topicTimeArray = [];
    this.readedTopics = [];

    this.topics = [];
    this.dailyTopicsHours = [];
    this.plusTopics = [];

    this.year = [];
    this.month = [];
    this.day = [];
    this.hour = [];
    this.minute = [];
    this.initializeTopics();
  }


  initializeTopics() {
      this.ref = firebase.database().ref('news/');
      this.ref
        .once('value')
        .then(res => {
          this.news = convertArray(res);

          let date: Date = new Date();
          this.actualDay = +date.getDate();

          for (let prop in this.news) {
            this.topicNameArray.push(this.news[prop].topic);
            this.topicTimeArray.push(this.news[prop].uploadDate);
          }

          //Firebase jelenlegi tárolása szerint, pontok mentén lehet vágni
          var i, j, k, tmp;

          j = 0;
          k = 0;
          for (let prop in this.topicTimeArray) {
            this.helperString = this.topicTimeArray[prop];
            var splitted = this.helperString.split(".", 5);
            this.day[prop] = +splitted[0];
            this.month[prop] = +splitted[1];
            this.year[prop] = +splitted[2];
            this.hour[prop] = +splitted[3];
            this.minute[prop] = +splitted[4];
            if (this.day[prop] == this.actualDay) {
              this.topics[j] = this.topicNameArray[prop];
              this.dailyTopicsHours[j] = this.hour[prop];
              j++;
            } else {
              this.plusTopics[k] = this.topicNameArray[prop];
              k++;
            }
          }

          for (i = this.topics.length - 1; 0 < i; --i) {
            for (j = 0; j < i; ++j) {
              if (this.dailyTopicsHours[j] < this.dailyTopicsHours[j + 1]) {
                tmp = this.topics[j];
                this.topics[j] = this.topics[j + 1];
                this.topics[j + 1] = tmp;

                tmp = this.dailyTopicsHours[j];
                this.dailyTopicsHours[j] = this.dailyTopicsHours[j + 1];
                this.dailyTopicsHours[j + 1] = tmp;
              }
            }
          }

          if (this.topics.length < 15) {
            for (i = 0; this.topics.length != 15; i++) {
              this.topics.push(this.plusTopics[i]);
            }
          }

          for (i = this.topics.length - 1; 0 < i; --i) { //Sort by text length
            for (j = 0; j < i; ++j) {
              if (this.topics[j].length < this.topics[j + 1].length) {
                tmp = this.topics[j];
                this.topics[j] = this.topics[j + 1];
                this.topics[j + 1] = tmp;
              }
            }
          }
        });
  }


  openNewQuestionPage() {
    this.navCtrl.push(NewQuestionPage);
  }

  openQuestionListPage(topicName: string) {
    this.storage.set('topic', topicName);
    this.navCtrl.push(QuestionListPage);
  }



}

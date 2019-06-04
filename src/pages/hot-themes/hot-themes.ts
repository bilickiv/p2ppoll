import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  actualMonth: any;
  actualYear: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HotThemesPage');
  }

  ionViewWillEnter() {
    this.nickName = localStorage.getItem('nickName');

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
        this.actualMonth = +date.getMonth() + 1;
        this.actualYear = +date.getFullYear();

        for (let prop in this.news) {
          this.topicNameArray.push(this.news[prop].topic);
          this.topicTimeArray.push(this.news[prop].uploadDate);
        }

        //Firebase new
        //Actual character . then split
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
          if (this.day[prop] == this.actualDay && this.month[prop] == this.actualMonth && this.year[prop] == this.actualYear) {
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
            this.topics.push(this.plusTopics[(this.actualDay-1) + i]); //Other day other array (random)
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
      }).catch(err => {
        console.log('websocket');
      });
  }

  openNewQuestionPage() {
    this.navCtrl.push(NewQuestionPage);
  }

  openQuestionListPage(topicName: string) {
    localStorage.setItem('topic', topicName);
    this.navCtrl.push(QuestionListPage);
  }

}

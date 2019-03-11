import { Component, ErrorHandler } from '@angular/core';
import { NavController, MenuController, AlertController, Platform } from 'ionic-angular';
import { QuestionListPage } from '../question-list/question-list';
import { NewQuestionPage } from '../new-question/new-question';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { convertArray } from '../../app/envrionment';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';

@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage {

  topics = new Array();
  topicsHelper = new Array();
  topicNameArray = new Array();
  topicBoolArray = new Array();
  savedQuestions = new Array();
  savedQuestionsIdArray = new Array();
  votedQuestionIds = new Array();
  readedTopics = new Array();
  limits = new Array();
  myQuestions = new Array();

  nickName: string;
  empty: boolean;
  ref: any;
  news: any;
  nickNames: any;
  helper: any;
  topicClassName: string;
  topicClass: any;
  topicIndex: string;
  firstRunCheck: number;
  sameNickname: boolean;
  random: number;
  question: string;

  constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public alertCtrl: AlertController, public errHandler: ErrorHandler, public platform: Platform) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.initializeArrays();
    this.nicknameSetter();
    this.countryCheck();
  }

  /*
  * This method check country. If hidden, and random == 7, pop up.
  */
  countryCheck() {
    this.random = Math.floor((Math.random() * 20) + 1);
    if (this.random == 7) {
      this.storage.get('country').then((country) => {
        if (country == "Hidden" && this.nickName != "Anonym") {
          this.countrySetter();
        }
      });
    }
  }

  /*
  * This method initialize index page content and database.
  * If this first run, then firstRunCheck variable not 1, start database variables, arrays initalize.
  * Display sort. This method contain firebase reference for new questions. If there is new question, 
  * we change the style.
  */
  initializeArrays() {
    //Async Database read
    this.storage.get('nickName').then((nickName) => {
      this.storage.get('firstRunCheck').then((firstRun) => {
        this.storage.get('topicBoolArray').then((topicBoolArray) => {
          this.storage.get('topicNameArray').then((topicNameArray) => {
            this.storage.get('readedTopics').then((readedTopics) => {

              this.nickName = nickName;
              if (this.nickName == undefined) {
                this.nickName = "Anonym";
              }

              this.topics = [];
              this.topicsHelper = [];
              this.topicNameArray = [];
              this.topicBoolArray = [];
              this.savedQuestions = [];
              this.savedQuestionsIdArray = [];
              this.votedQuestionIds = [];
              this.readedTopics = [];
              this.myQuestions = [];

              this.firstRunCheck = firstRun;

              if (this.firstRunCheck != 1) {
                this.topicNameArray = ["animation", "animal", "book", "car", "city", "clothes", "computer",
                  "country", "electronics", "ezoteric", "fitness", "food", "friend", "game", "healthy",
                  "hobby", "home", "internet", "language", "learning", "life", "love", "money", "movie",
                  "music", "nature", "online", "phone", "photo", "problem", "programming",
                  "relationship", "school", "science", "technology", "training", "transport", "travel",
                  "tvseries", "university", "work"
                                             
                ];

                this.storage.set('topicName', this.topicNameArray); // categorie choose !
                for (var x = 0; x < this.topicNameArray.length; x++) {
                  if (x < 15) {
                    this.topicBoolArray.push(true);
                  } else {
                    this.topicBoolArray.push(false);
                  }
                }

                this.limits[0] = 1999;
                this.limits[1] = 1;
                this.limits[2] = 1;
                this.limits[3] = 1;

                this.storage.set('limit', this.limits);
                this.storage.set('voteNumber', 0);
                this.storage.set('sumcheck', 15);
                this.storage.set('questionNumber', 0);
                this.storage.set('nickName', "Anonym");
                this.votedQuestionIds.push(0);
                this.storage.set('savedQuestions', this.savedQuestions);
                this.storage.set('savedQuestionsIdArray', this.savedQuestionsIdArray);
                this.storage.set('votedQuestionIds', this.votedQuestionIds);
                this.storage.set('country', "Hidden");
                this.storage.set('myQuestions', this.myQuestions);
              } else {
                this.topicBoolArray = topicBoolArray;
                this.topicNameArray = topicNameArray;
                this.readedTopics = readedTopics;
                this.storage.get('sumcheck').then((val) => {
                  console.log('sumcheck value:' + val);
                  if (val == 0) {
                    this.empty = true;
                  } else {
                    this.empty = false;
                  }
                });
              }

              var y = 0;
              for (x = 0; x < this.topicBoolArray.length; x++) {
                if (this.topicBoolArray[x]) { // Just selected topics name 
                  this.topics[y] = this.topicNameArray[x];
                  y++;
                }
              }

              var i, j, tmp;
              for (i = this.topics.length - 1; 0 < i; --i) { //Sort by text length
                for (j = 0; j < i; ++j) {
                  if (this.topics[j].length < this.topics[j + 1].length) {
                    tmp = this.topics[j];
                    this.topics[j] = this.topics[j + 1];
                    this.topics[j + 1] = tmp;
                  }
                }
              }

              for (i = 0; i < this.topics.length; i++) { //Helper Array to sort (design)
                console.log(this.topics[i]);
                this.topicsHelper[i] = this.topics[i];
              }

              if (this.topics.length >= 5 && this.topics.length <= 9) {  //Display Sort1
                this.topics[9] = this.topics[4];
                this.topics[4] = "";
                if (this.topics.length >= 6) {
                  this.topics[10] = this.topics[5];
                  this.topics[5] = "";
                  if (this.topics.length >= 7) {
                    this.topics[4] = this.topics[6];
                    this.topics[6] = "";
                    if (this.topics.length >= 8) {
                      this.topics[11] = this.topics[7];
                      this.topics[7] = "";
                    }
                  }
                }
              }

              if (this.topics.length >= 10 && this.topics.length <= 12) {  //Display Sort2
                this.topics[3] = this.topicsHelper[1];
                this.topics[4] = this.topicsHelper[2];
                this.topics[2] = this.topicsHelper[3];
                this.topics[8] = this.topicsHelper[4];
                this.topics[5] = this.topicsHelper[5];
                this.topics[6] = this.topicsHelper[6];
                this.topics[11] = this.topicsHelper[7];
                this.topics[12] = this.topicsHelper[8];
                this.topics[13] = this.topicsHelper[9];
                this.topics[1] = this.topicsHelper[0];
                this.topics[0] = "";
                this.topics[7] = "";
                this.topics[9] = "";
                if (this.topics.length >= 11) {
                  this.topics[14] = this.topicsHelper[10];
                  this.topics[10] = "";
                  if (this.topics.length >= 12) {
                    this.topics[7] = this.topicsHelper[11];
                  }
                }
              }

              this.setBasicState(this.topics);

              //this.firebaseDatabaseLoad(this.topics, this.topicNameArray, this.readedTopics);

              this.ref = firebase.database().ref('news/');
              this.ref
                .once('value')
                .then(res => {
                  this.news = convertArray(res);
                  this.storage.set('news', this.news);
                  for (let prop in this.news) {
                    this.helper = this.news[prop];

                    for (var x = 0; x < this.topics.length; x++) {

                      if (this.topics[x] == this.helper.topic) {

                        for (var y = 0; y < this.topicNameArray.length; y++) {

                          if (this.topics[x] == this.topicNameArray[y]) { //readedTopics[y]

                            if (this.readedTopics[y] != this.helper.id) {
                              this.topicIndex = x.toString();
                              this.topicClass = document.getElementById(this.topicIndex);
                              this.topicClassName = this.topicClass.className;

                              switch (this.topicClassName) {
                                case "pStyle-1": document.getElementById(this.topicIndex).classList.remove('pStyle-1');
                                  document.getElementById(this.topicIndex).classList.add('animatedStyle-1');
                                  break;
                                case "pStyle-2": document.getElementById(this.topicIndex).classList.remove('pStyle-2');
                                  document.getElementById(this.topicIndex).classList.add('animatedStyle-2');
                                  break;
                                case "pStyle-3": document.getElementById(this.topicIndex).classList.remove('pStyle-3');
                                  document.getElementById(this.topicIndex).classList.add('animatedStyle-3');
                                  break;
                                case "overStyle": document.getElementById(this.topicIndex).classList.remove('overStyle');
                                  document.getElementById(this.topicIndex).classList.add('animatedOverStyle');
                                  break;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }).catch(err => {
                  console.log('websocket');
                });

              this.storage.set('firstRunCheck', 1);
              this.storage.set('topicNameArray', this.topicNameArray);
              this.storage.set('topicBoolArray', this.topicBoolArray);
              this.storage.set('readedTopics', this.readedTopics);
            });
          });
        });
      });
    });
  }

  /*
  * Set basic state of topics on display.
  */

  setBasicState(topics: any) {
    for (var i = 0; i < topics.length; i++) {
      switch (this.topicClassName) {
        case "animatedStyle-1": document.getElementById(this.topicIndex).classList.remove('animatedStyle-1');
          document.getElementById(this.topicIndex).classList.add('pStyle-1');
          break;
        case "animatedStyle-2": document.getElementById(this.topicIndex).classList.remove('animatedStyle-2');
          document.getElementById(this.topicIndex).classList.add('pStyle-2');
          break;
        case "animatedStyle-3": document.getElementById(this.topicIndex).classList.remove('animatedStyle-3');
          document.getElementById(this.topicIndex).classList.add('pStyle-3');
          break;
        case "animatedOverStyle": document.getElementById(this.topicIndex).classList.remove('animatedOverStyle');
          document.getElementById(this.topicIndex).classList.add('overStyle');
          break;
      }
    }
  }

  openNewQuestionPage() {
    this.navCtrl.push(NewQuestionPage);
  }

  /*
  * Clicked topic added readedTopics array). 
  */
  openQuestionListPage(topicName: string) {
    this.storage.get('readedTopics').then((readedTopics) => {
      this.storage.get('topicNameArray').then((topicNameArray) => {
        this.storage.get('news').then((newsValues) => {
          this.news = newsValues;
          this.readedTopics = readedTopics;
          for (let prop in this.news) {

            this.helper = this.news[prop];
            if (this.helper.topic == topicName) {

              for (var x = 0; x < topicNameArray.length; x++) {

                if (topicNameArray[x] == topicName) {

                  this.readedTopics[x] = this.helper.id;
                  this.storage.set('readedTopics', this.readedTopics);
                }
              }

              for (x = 0; x < this.topics.length; x++) {

                if (this.topics[x] == this.helper.topic) {
                  this.topicIndex = x.toString();
                  this.topicClass = document.getElementById(this.topicIndex);
                  this.topicClassName = this.topicClass.className;

                  switch (this.topicClassName) {
                    case "animatedStyle-1": document.getElementById(this.topicIndex).classList.remove('animatedStyle-1');
                      document.getElementById(this.topicIndex).classList.add('pStyle-1');
                      break;
                    case "animatedStyle-2": document.getElementById(this.topicIndex).classList.remove('animatedStyle-2');
                      document.getElementById(this.topicIndex).classList.add('pStyle-2');
                      break;
                    case "animatedStyle-3": document.getElementById(this.topicIndex).classList.remove('animatedStyle-3');
                      document.getElementById(this.topicIndex).classList.add('pStyle-3');
                      break;
                    case "animatedOverStyle": document.getElementById(this.topicIndex).classList.remove('animatedOverStyle');
                      document.getElementById(this.topicIndex).classList.add('overStyle');
                      break;
                  }
                }
              }
            }
          }
        });
      });

      if (this.readedTopics.length != 0) {
        if (this.readedTopics.length > 5000) { // Database field clear, if greater than 5000 item
          var j = 0;
          this.readedTopics = [];
          for (var i = 2500; i < 5000; i++) {
            this.readedTopics[j] = readedTopics[i];
            j++;
          }
          this.storage.set('readedTopics', this.readedTopics);
        }
      }
    });
    this.storage.set('topic', topicName);
    this.navCtrl.push(QuestionListPage);
  }

  nicknameSetter() {
    this.storage.get('nickName').then((val) => {
      if (val == null || val == "Anonym") {
        this.nickName = "Anonym";
        this.generateNickname();
      } else {
        this.nickName = val;
      }
    });
  }

  generateNickname() {
    this.sameNickname = false;
    let alert = this.alertCtrl.create({
      title: 'New nickname',
      message: 'Please write a nickname!',
      inputs: [
        {
          name: 'title',
          id: 'maxLength10',
          placeholder: 'Your nickname'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.ref = firebase.database().ref('nicknames/');
            this.ref
              .once('value')
              .then(res => {
                this.nickNames = convertArray(res);
                for (let prop in this.nickNames) {
                  this.helper = this.nickNames[prop];
                  if (this.helper.nickname == data.title) {
                    this.sameNickname = true;
                  }
                }

                if (this.sameNickname) {
                  this.nickNameError();
                } else {
                  this.storage.set('nickName', data.title);
                  this.nickName = data.title;

                  var jsonFile = {
                    nickname: this.nickName
                  };

                  this.ref = firebase.database().ref("nicknames/");
                  let newItem = this.ref.push();
                  newItem.set(jsonFile);
                  this.countrySetter();
                }
              }).catch(err => {
                console.log('Error');
              });
          }
        },
      ]
    });

    alert.present().then(result => {
      document.getElementById('maxLength10').setAttribute('maxLength', '10');
    });
  }

  nickNameError() {
    const alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: 'This nickname is already taken!',
      buttons: [
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
            this.generateNickname();
          }
        }
      ]
    });
    alert.present();
  }

  countrySetter() {
    const alert = this.alertCtrl.create({
      title: 'Country',
      subTitle: 'Please set your country name. If set, you can improve statistics. Thank you!',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Go Settings',
          role: 'Ok',
          handler: () => {
            this.navCtrl.push(ProfileSettingsPage);
          }
        }
      ]
    });
    alert.present();
  }

}

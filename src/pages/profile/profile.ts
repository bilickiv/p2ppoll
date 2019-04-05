import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  nickName: string;
  voteNumber: any;
  questionNumber: any;
  country: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.getProfileData();
  }

  getProfileData() {
    this.nickName = localStorage.getItem('nickName');
    this.voteNumber = localStorage.getItem('voteNumber');
    this.questionNumber = localStorage.getItem('questionNumber');
    this.country = localStorage.getItem('country');
  }

  openHome() {
    this.navCtrl.setRoot(TabsPage);
  }

}

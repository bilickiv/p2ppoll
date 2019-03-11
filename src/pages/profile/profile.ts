import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.getProfileData();
  }

  getProfileData() {
    this.storage.get('nickName').then((val) => {
      this.nickName = val;
    });
    this.storage.get('voteNumber').then((val) => {
      this.voteNumber = val;
    });
    this.storage.get('questionNumber').then((val) => {
      this.questionNumber = val;
    });
    this.storage.get('country').then((val) => {
      this.country = val;
    });
  }

  openHome() {
    this.navCtrl.setRoot(TabsPage);
  }

}

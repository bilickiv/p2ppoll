import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ThemeChoosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categorie-choose',
  templateUrl: 'categorie-choose.html',
})
export class CategorieChoosePage {

  //change list

  sumCheck;

  topicNameArray = new Array();
  topicBoolArray = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public storage: Storage) {
    this.sumCheck = 0;
    this.topicBoolArray = [];
    this.topicNameArray = [];
    this.getDatabase();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThemeChoosePage');
    this.sumCheck = 0;
  }

  reloadPage() {
    this.navCtrl.pop(this.navCtrl.getActive().component);
  }

  /*
  * Save changes. Selected count max value: 15. Actual value in sumCheck.
  * This topics appear at index page.
  */
  choosenLimit(state: boolean, index: number) {
    this.storage.set('refresh', true);

    if (state) {
      ++this.sumCheck;
    } else {
      --this.sumCheck;
    }

    console.log(this.sumCheck);

    if (this.sumCheck > 15) {
      this.sumCheck = this.sumCheck - 1;
      this.setter(index, false);
      this.showAlert();
      this.reloadPage();
    } else {
      this.setter(index, state);
    }
    console.log('choosenLimit sumcheck value: ' + this.sumCheck);
  }

  setter(index: number, boolvalue: boolean) {
    this.storage.set('sumcheck', this.sumCheck);
    this.storage.get('topicBoolArray').then((val) => {
      this.topicBoolArray[index] = boolvalue;
      this.storage.set('topicBoolArray', this.topicBoolArray);
    });
  }

  getDatabase() {
    this.storage.get('topicNameArray').then((topicNameArray) => {
      this.storage.get('topicBoolArray').then((topicBoolArray) => {

        this.topicNameArray = topicNameArray;
        this.topicBoolArray = topicBoolArray;

        for (var i = 0; i < topicBoolArray.length; i++) {
          if (topicBoolArray[i]) {
            this.sumCheck++;
          }
        }
        this.storage.set('sumcheck', this.sumCheck); //reason -> reloadPage
      });
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Limit',
      subTitle: 'You can choose up to 15 topics!',
      buttons: ['OK']
    });
    alert.present();
  }

}






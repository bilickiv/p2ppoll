import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

  sumCheck = 0;

  topicNameArray = new Array();
  topicBoolArray = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
   this.topicBoolArray = [];
    this.topicNameArray = [];
    this.getDatabase();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThemeChoosePage');
  }

  reloadPage() {
    this.navCtrl.pop(this.navCtrl.getActive().component);
  }

  /*
  * Save changes. Selected count max value: 15. Actual value in sumCheck.
  * This topics appear at index page.
  */
  choosenLimit(state: boolean, index: number) {
    localStorage.setItem('refresh', 'true');

    if (state) {
      ++this.sumCheck;
    } else {
      --this.sumCheck;
    }

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
    localStorage.setItem('sumcheck', JSON.stringify(this.sumCheck));
    this.topicBoolArray[index] = boolvalue;
    localStorage.setItem('topicBoolArray', JSON.stringify(this.topicBoolArray));
  }

  getDatabase() {
    this.topicNameArray = JSON.parse(localStorage.getItem('topicNameArray'));
    this.topicBoolArray = JSON.parse(localStorage.getItem('topicBoolArray'));

    for (var i = 0; i < this.topicBoolArray.length; i++) {
      if (this.topicBoolArray[i]) {
        this.sumCheck++;
      }
    }

    localStorage.setItem('sumcheck', this.sumCheck.toString());

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






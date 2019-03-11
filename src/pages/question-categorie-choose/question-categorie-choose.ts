import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the QuestionCategorieChoosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-categorie-choose',
  templateUrl: 'question-categorie-choose.html',
})
export class QuestionCategorieChoosePage {

  sumCheck : number;

  catArray = [];

  catOne = "";
  catTwo = "";
  catThree = "";
  operation = "";

  topicNameArray = new Array();
  categorieBoolArray = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public storage: Storage) {
    this.catArray = [];
    this.sumCheck = 0;
    this.storage.set('catOne', null);
    this.storage.set('catTwo', null);
    this.storage.set('catThree', null);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThemeChoosePage');
  }

  ionViewWillEnter(){
    this.storage.get('topicNameArray').then((topicNameArray) =>{
      this.topicNameArray = topicNameArray;
      for(var i = 0; i<topicNameArray.length; i++){
        this.categorieBoolArray.push(false);
      }
    });
  }

  choosenLimit(state: boolean, index: number){ 
   
    if(state){
      ++this.sumCheck;
      this.operation = "add";
      console.log("add")
    }else{
      --this.sumCheck;
      this.operation = "del";
      console.log("del")
    } 

    console.log(this.sumCheck);

    if(this.sumCheck == 4){
      --this.sumCheck;
      this.showAlert();
      this.categorieBoolArray[index] = false;
      this.addCategories();    
    }else{
      this.setter(index, this.operation);
    }
    console.log(this.sumCheck);
  }

  setter(index: number, operation: string){

    if(operation == "del"){
      this.categorieBoolArray[index] = false;
    }
    
    if(operation == "add"){
      this.categorieBoolArray[index] = true;
    }

  }

  addCategories(){
    
    var j=0; 
    for(var i = 0; i<this.topicNameArray.length; i++){
      if(this.categorieBoolArray[i]){
        this.catArray[j] = this.topicNameArray[i];
        console.log(this.topicNameArray[i])
        j++;
      }
    }

    if(this.catArray[0] != ""){
      this.storage.set('catOne', this.catArray[0]);
      if(this.catArray[1] != ""){
        this.storage.set('catTwo', this.catArray[1]);
        if(this.catArray[2] != ""){
          this.storage.set('catThree', this.catArray[2]);
        }
      }
    }

    this.navCtrl.pop(this.navCtrl.getActive().component);
  }



  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Limit',
      subTitle: 'You can choose up to 3 categorie!',
      buttons: ['OK']
    });
    alert.present();
  }
}

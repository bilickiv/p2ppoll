import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionListPage } from './question-list';

@NgModule({
  imports: [
    IonicPageModule.forChild(QuestionListPage),
  ],
})
export class QuestionListPageModule {}

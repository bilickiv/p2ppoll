import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotThemesPage } from './hot-themes';

@NgModule({
  declarations: [
    HotThemesPage,
  ],
  imports: [
    IonicPageModule.forChild(HotThemesPage),
  ],
})
export class HotThemesPageModule {}

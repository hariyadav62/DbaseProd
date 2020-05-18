import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkstatusPage } from './workstatus';

@NgModule({
  declarations: [
    WorkstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkstatusPage),
  ],
})
export class WorkstatusPageModule {}

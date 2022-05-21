import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LogicielComponent } from './list/logiciel.component';
import { LogicielDetailComponent } from './detail/logiciel-detail.component';
import { LogicielUpdateComponent } from './update/logiciel-update.component';
import { LogicielDeleteDialogComponent } from './delete/logiciel-delete-dialog.component';
import { LogicielRoutingModule } from './route/logiciel-routing.module';

@NgModule({
  imports: [SharedModule, LogicielRoutingModule],
  declarations: [LogicielComponent, LogicielDetailComponent, LogicielUpdateComponent, LogicielDeleteDialogComponent],
  entryComponents: [LogicielDeleteDialogComponent],
})
export class LogicielModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LogicielComponent } from '../list/logiciel.component';
import { LogicielDetailComponent } from '../detail/logiciel-detail.component';
import { LogicielUpdateComponent } from '../update/logiciel-update.component';
import { LogicielRoutingResolveService } from './logiciel-routing-resolve.service';

const logicielRoute: Routes = [
  {
    path: '',
    component: LogicielComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LogicielDetailComponent,
    resolve: {
      logiciel: LogicielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LogicielUpdateComponent,
    resolve: {
      logiciel: LogicielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LogicielUpdateComponent,
    resolve: {
      logiciel: LogicielRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(logicielRoute)],
  exports: [RouterModule],
})
export class LogicielRoutingModule {}

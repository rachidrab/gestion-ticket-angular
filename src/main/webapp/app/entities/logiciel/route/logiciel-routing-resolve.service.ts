import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILogiciel, Logiciel } from '../logiciel.model';
import { LogicielService } from '../service/logiciel.service';

@Injectable({ providedIn: 'root' })
export class LogicielRoutingResolveService implements Resolve<ILogiciel> {
  constructor(protected service: LogicielService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILogiciel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((logiciel: HttpResponse<Logiciel>) => {
          if (logiciel.body) {
            return of(logiciel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Logiciel());
  }
}

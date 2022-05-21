import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILogiciel, getLogicielIdentifier } from '../logiciel.model';

export type EntityResponseType = HttpResponse<ILogiciel>;
export type EntityArrayResponseType = HttpResponse<ILogiciel[]>;

@Injectable({ providedIn: 'root' })
export class LogicielService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/logiciels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(logiciel: ILogiciel): Observable<EntityResponseType> {
    return this.http.post<ILogiciel>(this.resourceUrl, logiciel, { observe: 'response' });
  }

  update(logiciel: ILogiciel): Observable<EntityResponseType> {
    return this.http.put<ILogiciel>(`${this.resourceUrl}/${getLogicielIdentifier(logiciel) as number}`, logiciel, { observe: 'response' });
  }

  partialUpdate(logiciel: ILogiciel): Observable<EntityResponseType> {
    return this.http.patch<ILogiciel>(`${this.resourceUrl}/${getLogicielIdentifier(logiciel) as number}`, logiciel, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILogiciel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILogiciel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLogicielToCollectionIfMissing(logicielCollection: ILogiciel[], ...logicielsToCheck: (ILogiciel | null | undefined)[]): ILogiciel[] {
    const logiciels: ILogiciel[] = logicielsToCheck.filter(isPresent);
    if (logiciels.length > 0) {
      const logicielCollectionIdentifiers = logicielCollection.map(logicielItem => getLogicielIdentifier(logicielItem)!);
      const logicielsToAdd = logiciels.filter(logicielItem => {
        const logicielIdentifier = getLogicielIdentifier(logicielItem);
        if (logicielIdentifier == null || logicielCollectionIdentifiers.includes(logicielIdentifier)) {
          return false;
        }
        logicielCollectionIdentifiers.push(logicielIdentifier);
        return true;
      });
      return [...logicielsToAdd, ...logicielCollection];
    }
    return logicielCollection;
  }
}

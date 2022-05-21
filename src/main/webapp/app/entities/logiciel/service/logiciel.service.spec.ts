import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILogiciel, Logiciel } from '../logiciel.model';

import { LogicielService } from './logiciel.service';

describe('Logiciel Service', () => {
  let service: LogicielService;
  let httpMock: HttpTestingController;
  let elemDefault: ILogiciel;
  let expectedResult: ILogiciel | ILogiciel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LogicielService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Logiciel', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Logiciel()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Logiciel', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Logiciel', () => {
      const patchObject = Object.assign(
        {
          nom: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Logiciel()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Logiciel', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Logiciel', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLogicielToCollectionIfMissing', () => {
      it('should add a Logiciel to an empty array', () => {
        const logiciel: ILogiciel = { id: 123 };
        expectedResult = service.addLogicielToCollectionIfMissing([], logiciel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logiciel);
      });

      it('should not add a Logiciel to an array that contains it', () => {
        const logiciel: ILogiciel = { id: 123 };
        const logicielCollection: ILogiciel[] = [
          {
            ...logiciel,
          },
          { id: 456 },
        ];
        expectedResult = service.addLogicielToCollectionIfMissing(logicielCollection, logiciel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Logiciel to an array that doesn't contain it", () => {
        const logiciel: ILogiciel = { id: 123 };
        const logicielCollection: ILogiciel[] = [{ id: 456 }];
        expectedResult = service.addLogicielToCollectionIfMissing(logicielCollection, logiciel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logiciel);
      });

      it('should add only unique Logiciel to an array', () => {
        const logicielArray: ILogiciel[] = [{ id: 123 }, { id: 456 }, { id: 22099 }];
        const logicielCollection: ILogiciel[] = [{ id: 123 }];
        expectedResult = service.addLogicielToCollectionIfMissing(logicielCollection, ...logicielArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const logiciel: ILogiciel = { id: 123 };
        const logiciel2: ILogiciel = { id: 456 };
        expectedResult = service.addLogicielToCollectionIfMissing([], logiciel, logiciel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(logiciel);
        expect(expectedResult).toContain(logiciel2);
      });

      it('should accept null and undefined values', () => {
        const logiciel: ILogiciel = { id: 123 };
        expectedResult = service.addLogicielToCollectionIfMissing([], null, logiciel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(logiciel);
      });

      it('should return initial array if no Logiciel is added', () => {
        const logicielCollection: ILogiciel[] = [{ id: 123 }];
        expectedResult = service.addLogicielToCollectionIfMissing(logicielCollection, undefined, null);
        expect(expectedResult).toEqual(logicielCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

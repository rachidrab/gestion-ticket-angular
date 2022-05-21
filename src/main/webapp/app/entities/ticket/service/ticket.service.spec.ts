import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { TicketStatut } from 'app/entities/enumerations/ticket-statut.model';
import { TicketUrgence } from 'app/entities/enumerations/ticket-urgence.model';
import { ITicket, Ticket } from '../ticket.model';

import { TicketService } from './ticket.service';

describe('Ticket Service', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  let elemDefault: ITicket;
  let expectedResult: ITicket | ITicket[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      description: 'AAAAAAA',
      dateOuverture: currentDate,
      dateCloture: currentDate,
      statut: TicketStatut.EN_COURS,
      urgence: TicketUrgence.CRITIQUE,
      environnement: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateCloture: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Ticket', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateCloture: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOuverture: currentDate,
          dateCloture: currentDate,
        },
        returnedFromService
      );

      service.create(new Ticket()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ticket', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateCloture: currentDate.format(DATE_FORMAT),
          statut: 'BBBBBB',
          urgence: 'BBBBBB',
          environnement: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOuverture: currentDate,
          dateCloture: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ticket', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          statut: 'BBBBBB',
          urgence: 'BBBBBB',
          environnement: 'BBBBBB',
        },
        new Ticket()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateOuverture: currentDate,
          dateCloture: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ticket', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateCloture: currentDate.format(DATE_FORMAT),
          statut: 'BBBBBB',
          urgence: 'BBBBBB',
          environnement: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateOuverture: currentDate,
          dateCloture: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Ticket', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTicketToCollectionIfMissing', () => {
      it('should add a Ticket to an empty array', () => {
        const ticket: ITicket = { id: 123 };
        expectedResult = service.addTicketToCollectionIfMissing([], ticket);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticket);
      });

      it('should not add a Ticket to an array that contains it', () => {
        const ticket: ITicket = { id: 123 };
        const ticketCollection: ITicket[] = [
          {
            ...ticket,
          },
          { id: 456 },
        ];
        expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ticket);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ticket to an array that doesn't contain it", () => {
        const ticket: ITicket = { id: 123 };
        const ticketCollection: ITicket[] = [{ id: 456 }];
        expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ticket);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticket);
      });

      it('should add only unique Ticket to an array', () => {
        const ticketArray: ITicket[] = [{ id: 123 }, { id: 456 }, { id: 99668 }];
        const ticketCollection: ITicket[] = [{ id: 123 }];
        expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, ...ticketArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ticket: ITicket = { id: 123 };
        const ticket2: ITicket = { id: 456 };
        expectedResult = service.addTicketToCollectionIfMissing([], ticket, ticket2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ticket);
        expect(expectedResult).toContain(ticket2);
      });

      it('should accept null and undefined values', () => {
        const ticket: ITicket = { id: 123 };
        expectedResult = service.addTicketToCollectionIfMissing([], null, ticket, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ticket);
      });

      it('should return initial array if no Ticket is added', () => {
        const ticketCollection: ITicket[] = [{ id: 123 }];
        expectedResult = service.addTicketToCollectionIfMissing(ticketCollection, undefined, null);
        expect(expectedResult).toEqual(ticketCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

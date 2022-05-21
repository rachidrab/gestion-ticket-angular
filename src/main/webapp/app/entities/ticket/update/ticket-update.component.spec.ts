import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TicketService } from '../service/ticket.service';
import { ITicket, Ticket } from '../ticket.model';
import { ILogiciel } from 'app/entities/logiciel/logiciel.model';
import { LogicielService } from 'app/entities/logiciel/service/logiciel.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TicketUpdateComponent } from './ticket-update.component';

describe('Ticket Management Update Component', () => {
  let comp: TicketUpdateComponent;
  let fixture: ComponentFixture<TicketUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ticketService: TicketService;
  let logicielService: LogicielService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TicketUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TicketUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TicketUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ticketService = TestBed.inject(TicketService);
    logicielService = TestBed.inject(LogicielService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Logiciel query and add missing value', () => {
      const ticket: ITicket = { id: 456 };
      const logiciel: ILogiciel = { id: 76352 };
      ticket.logiciel = logiciel;

      const logicielCollection: ILogiciel[] = [{ id: 60220 }];
      jest.spyOn(logicielService, 'query').mockReturnValue(of(new HttpResponse({ body: logicielCollection })));
      const additionalLogiciels = [logiciel];
      const expectedCollection: ILogiciel[] = [...additionalLogiciels, ...logicielCollection];
      jest.spyOn(logicielService, 'addLogicielToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(logicielService.query).toHaveBeenCalled();
      expect(logicielService.addLogicielToCollectionIfMissing).toHaveBeenCalledWith(logicielCollection, ...additionalLogiciels);
      expect(comp.logicielsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const ticket: ITicket = { id: 456 };
      const developpeur: IUser = { id: 97759 };
      ticket.developpeur = developpeur;
      const client: IUser = { id: 21276 };
      ticket.client = client;

      const userCollection: IUser[] = [{ id: 97938 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [developpeur, client];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ticket: ITicket = { id: 456 };
      const logiciel: ILogiciel = { id: 87874 };
      ticket.logiciel = logiciel;
      const developpeur: IUser = { id: 59613 };
      ticket.developpeur = developpeur;
      const client: IUser = { id: 89503 };
      ticket.client = client;

      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ticket));
      expect(comp.logicielsSharedCollection).toContain(logiciel);
      expect(comp.usersSharedCollection).toContain(developpeur);
      expect(comp.usersSharedCollection).toContain(client);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = { id: 123 };
      jest.spyOn(ticketService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticket }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ticketService.update).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = new Ticket();
      jest.spyOn(ticketService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ticket }));
      saveSubject.complete();

      // THEN
      expect(ticketService.create).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ticket>>();
      const ticket = { id: 123 };
      jest.spyOn(ticketService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ticket });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ticketService.update).toHaveBeenCalledWith(ticket);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLogicielById', () => {
      it('Should return tracked Logiciel primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLogicielById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});

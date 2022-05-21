import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LogicielService } from '../service/logiciel.service';
import { ILogiciel, Logiciel } from '../logiciel.model';

import { LogicielUpdateComponent } from './logiciel-update.component';

describe('Logiciel Management Update Component', () => {
  let comp: LogicielUpdateComponent;
  let fixture: ComponentFixture<LogicielUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let logicielService: LogicielService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LogicielUpdateComponent],
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
      .overrideTemplate(LogicielUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LogicielUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    logicielService = TestBed.inject(LogicielService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const logiciel: ILogiciel = { id: 456 };

      activatedRoute.data = of({ logiciel });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(logiciel));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Logiciel>>();
      const logiciel = { id: 123 };
      jest.spyOn(logicielService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ logiciel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logiciel }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(logicielService.update).toHaveBeenCalledWith(logiciel);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Logiciel>>();
      const logiciel = new Logiciel();
      jest.spyOn(logicielService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ logiciel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: logiciel }));
      saveSubject.complete();

      // THEN
      expect(logicielService.create).toHaveBeenCalledWith(logiciel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Logiciel>>();
      const logiciel = { id: 123 };
      jest.spyOn(logicielService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ logiciel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(logicielService.update).toHaveBeenCalledWith(logiciel);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITicket, Ticket } from '../ticket.model';
import { TicketService } from '../service/ticket.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILogiciel } from 'app/entities/logiciel/logiciel.model';
import { LogicielService } from 'app/entities/logiciel/service/logiciel.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { TicketStatut } from 'app/entities/enumerations/ticket-statut.model';
import { TicketUrgence } from 'app/entities/enumerations/ticket-urgence.model';

@Component({
  selector: 'jhi-ticket-update',
  templateUrl: './ticket-update.component.html',
})
export class TicketUpdateComponent implements OnInit {
  isSaving = false;
  ticketStatutValues = Object.keys(TicketStatut);
  ticketUrgenceValues = Object.keys(TicketUrgence);

  logicielsSharedCollection: ILogiciel[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    dateOuverture: [],
    dateCloture: [],
    statut: [],
    urgence: [],
    environnement: [],
    logiciel: [],
    developpeur: [],
    client: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected ticketService: TicketService,
    protected logicielService: LogicielService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ticket }) => {
      this.updateForm(ticket);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gestionticketsApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ticket = this.createFromForm();
    if (ticket.id !== undefined) {
      this.subscribeToSaveResponse(this.ticketService.update(ticket));
    } else {
      this.subscribeToSaveResponse(this.ticketService.create(ticket));
    }
  }

  trackLogicielById(_index: number, item: ILogiciel): number {
    return item.id!;
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ticket: ITicket): void {
    this.editForm.patchValue({
      id: ticket.id,
      description: ticket.description,
      dateOuverture: ticket.dateOuverture,
      dateCloture: ticket.dateCloture,
      statut: ticket.statut,
      urgence: ticket.urgence,
      environnement: ticket.environnement,
      logiciel: ticket.logiciel,
      developpeur: ticket.developpeur,
      client: ticket.client,
    });

    this.logicielsSharedCollection = this.logicielService.addLogicielToCollectionIfMissing(this.logicielsSharedCollection, ticket.logiciel);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      ticket.developpeur,
      ticket.client
    );
  }

  protected loadRelationshipsOptions(): void {
    this.logicielService
      .query()
      .pipe(map((res: HttpResponse<ILogiciel[]>) => res.body ?? []))
      .pipe(
        map((logiciels: ILogiciel[]) =>
          this.logicielService.addLogicielToCollectionIfMissing(logiciels, this.editForm.get('logiciel')!.value)
        )
      )
      .subscribe((logiciels: ILogiciel[]) => (this.logicielsSharedCollection = logiciels));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(users, this.editForm.get('developpeur')!.value, this.editForm.get('client')!.value)
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITicket {
    return {
      ...new Ticket(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateOuverture: this.editForm.get(['dateOuverture'])!.value,
      dateCloture: this.editForm.get(['dateCloture'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      urgence: this.editForm.get(['urgence'])!.value,
      environnement: this.editForm.get(['environnement'])!.value,
      logiciel: this.editForm.get(['logiciel'])!.value,
      developpeur: this.editForm.get(['developpeur'])!.value,
      client: this.editForm.get(['client'])!.value,
    };
  }
}

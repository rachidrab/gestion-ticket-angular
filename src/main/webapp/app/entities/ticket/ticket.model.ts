import dayjs from 'dayjs/esm';
import { ILogiciel } from 'app/entities/logiciel/logiciel.model';
import { IUser } from 'app/entities/user/user.model';
import { TicketStatut } from 'app/entities/enumerations/ticket-statut.model';
import { TicketUrgence } from 'app/entities/enumerations/ticket-urgence.model';

export interface ITicket {
  id?: number;
  description?: string | null;
  dateOuverture?: dayjs.Dayjs | null;
  dateCloture?: dayjs.Dayjs | null;
  statut?: TicketStatut | null;
  urgence?: TicketUrgence | null;
  environnement?: string | null;
  logiciel?: ILogiciel | null;
  developpeur?: IUser | null;
  client?: IUser | null;
}

export class Ticket implements ITicket {
  constructor(
    public id?: number,
    public description?: string | null,
    public dateOuverture?: dayjs.Dayjs | null,
    public dateCloture?: dayjs.Dayjs | null,
    public statut?: TicketStatut | null,
    public urgence?: TicketUrgence | null,
    public environnement?: string | null,
    public logiciel?: ILogiciel | null,
    public developpeur?: IUser | null,
    public client?: IUser | null
  ) {}
}

export function getTicketIdentifier(ticket: ITicket): number | undefined {
  return ticket.id;
}

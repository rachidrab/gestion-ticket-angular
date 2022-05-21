import { ITicket } from 'app/entities/ticket/ticket.model';

export interface ILogiciel {
  id?: number;
  nom?: string;
  description?: string | null;
  tickets?: ITicket[] | null;
}

export class Logiciel implements ILogiciel {
  constructor(public id?: number, public nom?: string, public description?: string | null, public tickets?: ITicket[] | null) {}
}

export function getLogicielIdentifier(logiciel: ILogiciel): number | undefined {
  return logiciel.id;
}

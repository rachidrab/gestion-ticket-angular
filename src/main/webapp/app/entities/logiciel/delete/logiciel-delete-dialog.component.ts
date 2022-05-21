import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILogiciel } from '../logiciel.model';
import { LogicielService } from '../service/logiciel.service';

@Component({
  templateUrl: './logiciel-delete-dialog.component.html',
})
export class LogicielDeleteDialogComponent {
  logiciel?: ILogiciel;

  constructor(protected logicielService: LogicielService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.logicielService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

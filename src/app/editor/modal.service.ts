import * as _ from 'underscore';

export class ModalService {
   private modals: any[] = [];

   add(modal: any) {
       // add modal to array of active modals
       console.log(modal);
       this.modals.push(modal);
   }

   remove(id: string) {
       // remove modal from array of active modals
       let modalToRemove = _.findWhere(this.modals, { id: id });
       this.modals = _.without(this.modals, modalToRemove);
   }

   open(header, id: string) {
       // open modal specified by id
       let modal = _.findWhere(this.modals, { id: id });
       modal.open(header);
   }

   close(id: string) {
       // close modal specified by id
       let modal = _.find(this.modals, { id: id });
       modal.close();
   }
}

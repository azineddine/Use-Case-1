import { LightningElement, api, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import MOVIES_PREVIEW_MESSAGE from '@salesforce/messageChannel/Movies__c';

export default class MovieTile extends LightningElement {
    @api 
    movie;

    @wire(MessageContext)
    messageContext;

    previewMovie() {
        const payload = {Id : this.movie.Id};
        publish(this.messageContext, MOVIES_PREVIEW_MESSAGE, payload);
    }
}

import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Movie__c.Name';

import MOVIE_OBJECT from '@salesforce/schema/Movie__c';
import CATEGORY_FIELD from '@salesforce/schema/Movie__c.Category__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Movie__c.Description__c';
import RELEASE_DATE_FIELD from '@salesforce/schema/Movie__c.Release_date__c';

export default class NewMovieModal extends LightningElement {

    fields = [NAME_FIELD, CATEGORY_FIELD, DESCRIPTION_FIELD, RELEASE_DATE_FIELD];
    objectApiName = MOVIE_OBJECT;

    @api isopen;

    handleCancel() {
       this.sendEvent();
    }

    handleSuccess() {
       this.sendEvent();
    }

    sendEvent() {
        const modalEvent = new CustomEvent('close');
        this.dispatchEvent(modalEvent);
    }

}
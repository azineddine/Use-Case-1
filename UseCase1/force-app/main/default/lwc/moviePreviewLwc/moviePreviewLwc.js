import { LightningElement, wire} from 'lwc';
import { MessageContext, subscribe, unsubscribe, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, deleteRecord } from 'lightning/uiRecordApi';

import MOVIES_PREVIEW_MESSAGE from '@salesforce/messageChannel/Movies__c';
import REFRESH_LIST from '@salesforce/messageChannel/Refresh_List__c';

import NAME_FIELD from '@salesforce/schema/Movie__c.Name';

import MOVIE_OBJECT from '@salesforce/schema/Movie__c';
import CATEGORY_FIELD from '@salesforce/schema/Movie__c.Category__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Movie__c.Description__c';
import RELEASE_DATE_FIELD from '@salesforce/schema/Movie__c.Release_date__c';

export default class RecordFormExample extends LightningElement {
    // Expose a field to make it available in the template
    fields = [NAME_FIELD, CATEGORY_FIELD, DESCRIPTION_FIELD, RELEASE_DATE_FIELD];
    objectApiName = MOVIE_OBJECT;

    // Flexipage provides recordId and objectApiName
    movieId;

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, {recordId : '$movieId', fields})
    movie;

    mode = 'readonly';
    isViewMode = true;
    subscription = null;

    connectedCallback() {
        this.subscription = subscribe(this.messageContext, MOVIES_PREVIEW_MESSAGE, (message) => this.handleMessage(message));
    }
    
    handleMessage(message){
        this.movieId = message.Id
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleSuccess() {
        publish(this.messageContext, REFRESH_LIST);
        this.showTestMessage(
            'Edit with success',
             'You have edited your record successfully',
            'success',
        );
        this.mode = 'readonly';
        this.isViewMode = true;
    }

    

    handleUpdateBtn() {
        this.mode = 'edit';
        this.isViewMode = false;
    }

    handleDeleteBtn() {
        deleteRecord(this.movieId)
        .then(() => {
            publish(this.messageContext, REFRESH_LIST);
        })

        this.movieId = null;
    }

    showTestMessage(title, message, variant) {
        const event = new ShowToastEvent({
            title : title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
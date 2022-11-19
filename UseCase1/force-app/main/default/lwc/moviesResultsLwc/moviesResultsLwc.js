import { LightningElement, wire, api } from 'lwc';
import searchMovies from '@salesforce/apex/MoviesController.searchMovies';

import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import REFRESH_LIST from '@salesforce/messageChannel/Refresh_List__c';

export default class MoviesList extends LightningElement {

    subscription = null;

    @api searchValue = '';
    
    @wire(searchMovies, {searchTerm: '$searchValue' })
    movies;

}

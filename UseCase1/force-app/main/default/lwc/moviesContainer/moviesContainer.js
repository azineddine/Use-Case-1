import { LightningElement, wire } from "lwc";
import {
  subscribe,
  MessageContext,
  unsubscribe
} from "lightning/messageService";
import REFRESH_LIST from "@salesforce/messageChannel/Refresh_List__c";

export default class MoviesContainer extends LightningElement {
  searchValue = "";
  subscription = null;
  isOpen = false;

  handleNewSearch(event) {
    this.searchValue = event.detail;
  }

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscription = subscribe(this.messageContext, REFRESH_LIST, () => {
      this.refreshMoviesList();
    });
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
  }

  handleClose() {
    this.isOpen = false;
    this.refreshMoviesList();
  }

  refreshMoviesList() {
    this.template.querySelector("c-movies-results-lwc").refresh();
  }

  openModal() {
    this.isOpen = true;
  }
}

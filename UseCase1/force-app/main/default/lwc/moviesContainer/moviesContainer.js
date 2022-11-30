import { LightningElement, wire } from "lwc";
import {
  subscribe,
  MessageContext,
  unsubscribe
} from "lightning/messageService";
import REFRESH_LIST from "@salesforce/messageChannel/Refresh_List__c";

export default class MoviesContainer extends LightningElement {
  @wire(MessageContext)
  messageContext;
  searchValue = "";
  subscription = null;
  isOpen = false;

  handleNewSearch(event) {
    this.searchValue = event.detail;
  }

  connectedCallback() {
    this.subscription = subscribe(this.messageContext, REFRESH_LIST, () => {
      this.refreshMoviesList();
    });
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
  }

  refreshMoviesList() {
    this.template.querySelector("c-movies-results").refresh();
  }

  openModal() {
    this.isOpen = true;
  }

  handleCloseModal() {
    this.isOpen = false;
  }
}

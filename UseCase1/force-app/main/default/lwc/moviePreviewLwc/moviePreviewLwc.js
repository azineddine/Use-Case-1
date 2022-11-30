import { LightningElement, wire, track } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe,
  publish
} from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {
  getRecord,
  deleteRecord,
  getRecordNotifyChange
} from "lightning/uiRecordApi";
import getActorsByMovie from "@salesforce/apex/ActorsController.getActorsByMovie";

import MOVIES_PREVIEW_MESSAGE from "@salesforce/messageChannel/Movies__c";
import REFRESH_LIST from "@salesforce/messageChannel/Refresh_List__c";

import NAME_FIELD from "@salesforce/schema/Movie__c.Name";
import MOVIE_OBJECT from "@salesforce/schema/Movie__c";
import CATEGORY_FIELD from "@salesforce/schema/Movie__c.Category__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Movie__c.Description__c";
import RELEASE_DATE_FIELD from "@salesforce/schema/Movie__c.Release_date__c";
import PICTURE_FIELD from "@salesforce/schema/Movie__c.Picture__c";
import RATING_FIELD from "@salesforce/schema/Movie__c.Rating__c";
import ID from "@salesforce/schema/Movie__c.Id";

const DELETE_SUCCESS_TITLE = "Delete with success";
const DELETE_SUCCESS_MESSAGE = "You have deleted your record successfully";
const DELETE_SUCCESS_VARIANT = "success";

const MOVIE_FIELDS = [
  NAME_FIELD,
  CATEGORY_FIELD,
  DESCRIPTION_FIELD,
  RELEASE_DATE_FIELD,
  PICTURE_FIELD,
  RATING_FIELD,
  ID
];

export default class RecordFormExample extends LightningElement {
  // Expose a field to make it available in the template
  @wire(MessageContext)
  messageContext;
  subscription = null;
  isOpen = false;
  objectApiName = MOVIE_OBJECT;
  movieId;
  @track
  movie = {};
  movieActors = [];
  hasActors;


  @wire(getRecord, { recordId: "$movieId", fields: MOVIE_FIELDS })
  getMovie({ data, error }) {
    if (data && data.fields) {
      for (const [key, value] of Object.entries(data.fields)) {
        this.movie[key] = value.value;
      }
      this.movie[ID] = data.ID;
    }
  }

  @wire(getActorsByMovie, { movieId: "$movieId" })
  getActors({ data, error }) {
    this.movieActors = data;
    this.hasActors = data && data.length > 0;
    if (data) {
      this.movie.Actors = [...data];
    }
  }

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      MOVIES_PREVIEW_MESSAGE,
      (message) => this.handleMessage(message)
    );
  }

  handleMessage(message) {
    this.movieId = message.Id;
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleUpdateBtn() {
    this.openModal();
  }

  handleDeleteBtn() {
    deleteRecord(this.movieId).then(() => {
      publish(this.messageContext, REFRESH_LIST);
    });
    this.showTestMessage(
      DELETE_SUCCESS_TITLE,
      DELETE_SUCCESS_MESSAGE,
      DELETE_SUCCESS_VARIANT
    );
    this.movieId = null;
  }

  showTestMessage(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }

  openModal() {
    this.isOpen = true;
  }

  handleCloseModal() {
    this.isOpen = false;
  }

  refreshMoviesList() {
    publish(this.messageContext, REFRESH_LIST);
    getRecordNotifyChange([{ recordId: this.movieId }]);
  }
}

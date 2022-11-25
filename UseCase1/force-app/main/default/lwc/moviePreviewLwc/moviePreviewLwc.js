import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe,
  publish
} from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, deleteRecord } from "lightning/uiRecordApi";

import MOVIES_PREVIEW_MESSAGE from "@salesforce/messageChannel/Movies__c";
import REFRESH_LIST from "@salesforce/messageChannel/Refresh_List__c";

import NAME_FIELD from "@salesforce/schema/Movie__c.Name";

import MOVIE_OBJECT from "@salesforce/schema/Movie__c";
import CATEGORY_FIELD from "@salesforce/schema/Movie__c.Category__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Movie__c.Description__c";
import RELEASE_DATE_FIELD from "@salesforce/schema/Movie__c.Release_date__c";

const READ_ONLY = "readonly";
const EDIT = "edit";

const EDIT_SUCCESS_TITLE = "Edit with success";
const EDIT_SUCCESS_MESSAGE = "You have edited your record successfully";
const EDIT_SUCCESS_VARIANT = "success";

const DELETE_SUCCESS_TITLE = "Delete with success";
const DELETE_SUCCESS_MESSAGE = "You have deleted your record successfully";
const DELETE_SUCCESS_VARIANT = "success";

export default class RecordFormExample extends LightningElement {
  // Expose a field to make it available in the template
  objectApiName = MOVIE_OBJECT;

  fields = [NAME_FIELD, CATEGORY_FIELD, DESCRIPTION_FIELD, RELEASE_DATE_FIELD];

  // Flexipage provides recordId and objectApiName
  movieId;

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: "$movieId", fields })
  movie;

  mode = READ_ONLY;
  isViewMode = true;
  subscription = null;

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

  handleSuccess() {
    publish(this.messageContext, REFRESH_LIST);
    this.showTestMessage(
      EDIT_SUCCESS_TITLE,
      EDIT_SUCCESS_MESSAGE,
      EDIT_SUCCESS_VARIANT
    );
    this.mode = READ_ONLY;
    this.isViewMode = true;
  }

  handleUpdateBtn() {
    this.mode = EDIT;
    this.isViewMode = false;
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
}

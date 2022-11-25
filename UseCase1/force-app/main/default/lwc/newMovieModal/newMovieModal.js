import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import { createRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import NAME_FIELD from "@salesforce/schema/Movie__c.Name";
import MOVIE_OBJECT from "@salesforce/schema/Movie__c";
import MOVIE_ACTOR_OBJECT from "@salesforce/schema/MovieActor__c";

import CATEGORY_FIELD from "@salesforce/schema/Movie__c.Category__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Movie__c.Description__c";
import RELEASE_DATE_FIELD from "@salesforce/schema/Movie__c.Release_date__c";

import apexSearch from '@salesforce/apex/ActorsController.search';
import apexCreateMovie from '@salesforce/apex/MoviesController.createMovie';



const CREATE_SUCCESS_TITLE = "Created with success";
const CREATE_SUCCESS_MESSAGE = "You have created your record successfully";
const CREATE_SUCCESS_VARIANT = "success";

const CREATE_ERROR_TITLE = "Error creating record";
const CREATE_ERROR_VARIANT = "Error";

export default class NewMovieModal extends LightningElement {
  fields = [NAME_FIELD, CATEGORY_FIELD, DESCRIPTION_FIELD, RELEASE_DATE_FIELD];
  nameField = NAME_FIELD;
  categoryField = CATEGORY_FIELD;
  descriptionField = DESCRIPTION_FIELD;
  releaseDateField = RELEASE_DATE_FIELD;

  objectApiName = MOVIE_OBJECT;

  objectData = {};
  selectedActorIds = [];

  // new fields
  name;

  statusOptions = [
    { value: "new", label: "New", description: "A new item" },
    {
      value: "in-progress",
      label: "In Progress",
      description: "Currently working on this item"
    },
    {
      value: "finished",
      label: "Finished",
      description: "Done working on this item"
    }
  ];

  @api isopen;

  @wire(getObjectInfo, { objectApiName: MOVIE_OBJECT })
    objectInfo;
    


  handleSearchActor(event) {
    console.log('detail:',JSON.stringify(event.detail));
    const lookupElement = event.target;
    apexSearch(event.detail).
    then(results => {
      console.log('success', results);
      lookupElement.setSearchResults(results);
    })
    .catch(error => {
      console.log('error', error);
    })
  }

  handleSelectionActor(event){
    this.selectedActorIds = event.detail;
 }


    handleFieldChange(event) {
    this.objectData[event.target.name] = event.target.value;
  }

  createMovieHandler() {
  
    apexCreateMovie({movie :  this.objectData, actorIds : this.selectedActorIds})
      .then((createdMovie) => {
        this.sendEvent();
        this.showToastMessage(
          CREATE_SUCCESS_TITLE,
          CREATE_SUCCESS_MESSAGE,
          CREATE_SUCCESS_VARIANT
        );
       
      })
      .catch((error) => {
        console.log(error);
        this.showToastMessage(
          CREATE_ERROR_TITLE,
          error.body.message,
          CREATE_ERROR_VARIANT
        );
      }); 
  }

  handleCancel() {
    this.sendEvent();
  }

  handleSuccess() {
    this.showToastMessage(
      CREATE_SUCCESS_TITLE,
      CREATE_SUCCESS_MESSAGE,
      CREATE_SUCCESS_VARIANT
    );

    this.sendEvent();
  }

  sendEvent() {
    const modalEvent = new CustomEvent("close");
    this.dispatchEvent(modalEvent);
  }

  showToastMessage(title, message, variant) {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }
}

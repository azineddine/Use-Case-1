import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import { getRecord } from "lightning/uiRecordApi";

import NAME_FIELD from "@salesforce/schema/Movie__c.Name";
import MOVIE_OBJECT from "@salesforce/schema/Movie__c";
import ACTOR_OBJECT from "@salesforce/schema/Actor__c";
import MOVIE_ACTOR_OBJECT from "@salesforce/schema/MovieActor__c";

import CATEGORY_FIELD from "@salesforce/schema/Movie__c.Category__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Movie__c.Description__c";
import RELEASE_DATE_FIELD from "@salesforce/schema/Movie__c.Release_date__c";
import PICTURE_FIELD from "@salesforce/schema/Movie__c.Picture__c";
import RATING_FIELD from "@salesforce/schema/Movie__c.Rating__c";
import apexSearch from "@salesforce/apex/ActorsController.search";
import apexCreateMovie from "@salesforce/apex/MoviesController.createMovie";

import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";


const CREATE_SUCCESS_TITLE = "Created with success";
const CREATE_SUCCESS_MESSAGE = "You have created your record successfully";
const CREATE_SUCCESS_VARIANT = "success";

const CREATE_ERROR_TITLE = "Error creating record";
const CREATE_ERROR_VARIANT = "Error";

export default class NewMovieModal extends LightningElement {
  fields = [
    NAME_FIELD,
    CATEGORY_FIELD,
    DESCRIPTION_FIELD,
    RELEASE_DATE_FIELD,
    PICTURE_FIELD
  ];
  nameField = NAME_FIELD;
  categoryField = CATEGORY_FIELD;
  descriptionField = DESCRIPTION_FIELD;
  releaseDateField = RELEASE_DATE_FIELD;
  objectApiName = MOVIE_OBJECT;
  pictureField = PICTURE_FIELD;

  @track
  objectData = {};
  selectedActorIds = [];
  initialSelection = [];

  @api
  movie;

  hasRendered = false;
  _isopen = false;

  defaultMovieRecordTypeId;
  @track
  categoryPicklistValues = [];

  @wire(getObjectInfo, { objectApiName: MOVIE_OBJECT })
  objectInfo({ data, error }) {
    if (data) {
      this.defaultMovieRecordTypeId = data.defaultRecordTypeId;
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$defaultMovieRecordTypeId",
    fieldApiName: CATEGORY_FIELD
  })
  categoryPicklist({data,error}) {
    if(data) {
      this.categoryPicklistValues = data.values;
    }
  }

  @api
  get isopen() {
    return this._isopen;
  }
  set isopen(value) {
    this.hasRendered = false;
    this._isopen = value;
  }

  /*  @wire(getObjectInfo, { objectApiName: MOVIE_OBJECT })
  objectInfo; */

  // is called each time the movie is updated
  renderedCallback() {
    if (
      this.movie &&
      Object.keys(this.movie).length > 0 &&
      !this.hasRendered
      // && Object.keys(this.objectData).length === 0
    ) {

      this.hasRendered = true;

      this.objectData = { ...this.movie };

      if (this.movie.Actors) {
        this.initialSelection = this.movie.Actors.map((actor) => {
          return {
            id: actor.Id,
            sObjectType: ACTOR_OBJECT,
            icon: null,
            title: actor.Name,
            subtitle: actor.Id
          };
        });
        this.selectedActorIds = this.initialSelection.map((actor) => {
          return actor.id
        });
      }
    }
  }

  handleSearchActor(event) {
    const lookupElement = event.target;
    apexSearch(event.detail)
      .then((results) => {
        lookupElement.setSearchResults(results);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  handleSelectionActor(event) {
    this.selectedActorIds = event.detail;
  }

  handleFieldChange(event) {
    this.objectData[event.target.name] = event.target.value;
  }

  handleRatingChange(event) {
    this.objectData[RATING_FIELD.fieldApiName] = event.detail.rating;
  }

  handleMovieCreation() {
    apexCreateMovie({ movie: this.objectData, actorIds: this.selectedActorIds })
      .then((createdMovie) => {
        this.handleCloseModal();
        this.handleRefreshMovies();
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

  handleCloseModal() {
    this.objectData = {};
    const closeEvent = new CustomEvent("closemodal");
    this.dispatchEvent(closeEvent);
  }

  handleRefreshMovies() {
    const refreshEvent = new CustomEvent("refresh");
    this.dispatchEvent(refreshEvent);
  }

  /*  handleCancel() {
    this.sendEvent();
  }
 */
  /* handleSuccess() {
    this.showToastMessage(
      CREATE_SUCCESS_TITLE,
      CREATE_SUCCESS_MESSAGE,
      CREATE_SUCCESS_VARIANT
    );

    this.sendEvent();
  } */

  /* sendEvent() {
    const modalEvent = new CustomEvent("close");
    this.dispatchEvent(modalEvent);
  } */

  showToastMessage(title, message, variant) {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }
}

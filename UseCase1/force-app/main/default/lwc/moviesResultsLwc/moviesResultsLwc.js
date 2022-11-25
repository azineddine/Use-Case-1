import { LightningElement, wire, api } from "lwc";
import searchMovies from "@salesforce/apex/MoviesController.searchMovies";

import { refreshApex } from "@salesforce/apex";

export default class MoviesList extends LightningElement {
  subscription = null;

  @api searchValue = "";

  @wire(searchMovies, { searchTerm: "$searchValue" })
  movies;

  @api refresh() {
    refreshApex(this.movies);
  }
}

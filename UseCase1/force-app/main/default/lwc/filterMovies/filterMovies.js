import { LightningElement } from 'lwc';

export default class FilterMovies extends LightningElement {


    handleSearchMovieChange(event) {
        const searchEvent = new CustomEvent('search', {detail: event.target.value});
        this.dispatchEvent(searchEvent);
    }
}
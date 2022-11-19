import { LightningElement } from 'lwc';

export default class FilterMoviesLwc extends LightningElement {


    handleSearchMovieChange(event) {
        const searchEvent = new CustomEvent('search', {detail: event.target.value});
        this.dispatchEvent(searchEvent);
    }
}
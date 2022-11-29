import { LightningElement, api } from 'lwc';

export default class CustomModal extends LightningElement {
    @api 
    isopen;

    handleClose() {
        const closeEvent = new CustomEvent('closemodal' , {bubbles: true, composed: true});
        this.dispatchEvent(closeEvent);
    }

    handleSubmit() {
        const submitEvent = new CustomEvent('submitmodal' , {bubbles: true, composed: true});
        this.dispatchEvent(submitEvent);
    }
}
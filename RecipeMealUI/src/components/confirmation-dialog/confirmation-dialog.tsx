import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";

@Component({
    tag: 'confirmation-dialog',
    styleUrl: 'confirmation-dialog.css',
    shadow : true,
})
export class confirmationDialog{
    @Prop() open: boolean = false;
    @Prop() heading: string = 'Are you sure?';
    @Prop() message: string = 'This action cannot be undone';
    @Prop() confirmLabel: string = 'Delete';
    @Prop() cancelLabel: string = 'Cancel';

    @Event({ eventName: 'confirm'}) confirm!:  EventEmitter<void>;
    @Event({ eventName: 'cancel' }) cancel!: EventEmitter<void>;

    render(){
        return(
           <modal-dialog open={this.open} onModal-close={() =>this.cancel.emit()}>
            <span slot="title">{this.heading}</span>
            <p class="message">{this.message}</p>
            <div slot="footer">
                <button class="btn cancel" type="button" onClick={ ()=> this.cancel.emit()}>
                    {this.cancelLabel}
                </button>
                <button class={{btn: true, confirm: true, danger: true }} type="button" onClick={() => this.confirm.emit()}>
                    {this.confirmLabel}
                </button>
            </div>
           </modal-dialog>
        );
    }
}
import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";

@Component({
  tag: 'modal-dialog',
  styleUrl: 'modal-dialog.css',
  shadow: true,
})
export class ModalDialog {
  @Prop() open: boolean = false;

  @Event({eventName: 'modal-close'}) modalClose!: EventEmitter<void>;
  
  onBackdropClick = (e: MouseEvent) =>{
    if(e.target == e.currentTarget){
      this.modalClose.emit();
    }
  }

  onCloseClick = () =>{
    this.modalClose.emit();
  }

  render(){
    if(!this.open) return null;

    return(
      <div class="backdrop" onClick={this.onBackdropClick}>
        <div class="dialog">
          <header>
            <div class="title">
              <slot name="title"/>
            </div>
            <button class="close" type="button" onClick={this.onCloseClick}>✕</button>
          </header>
          <div class="body">
            <slot/>
          </div>
          <footer>
            <slot name="footer"/>
          </footer>
        </div>
      </div>
    );
  }
}
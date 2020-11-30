
import React from 'react';
import { FormContext } from '../Components/Form/withForm'

class SyntheticForm extends React.PureComponent {
    constructor() {
      super();
      this._timeoutID = null;
      this._isManagingFocus = false;
      this.onFocus = this.onFocus.bind(this)
      this.onBlur = this.onBlur.bind(this)
      this.onKeyDown = this.onKeyDown.bind(this)
      this.onClick = this.onClick.bind(this)
    }

    onClick(e){
      const { onSubmit=()=>{}, onReset=()=>{} } = this.props
      const { type } = e.toElement
      if(type === 'submit'){
        onSubmit(e)  // Trigger submit
      }else if(type === 'reset'){
        onReset(e)  // Trigger reset
      }
    }
    onKeyDown(e){
      const { tagName='' } = document.activeElement || {}
      const inputs = ['input', 'select', 'button', 'textarea'];
      const { onSubmit=()=>{} } = this.props
      if (inputs.indexOf(tagName.toLowerCase()) !== -1 && e.key === 'Enter') {
        if(tagName.toLowerCase() === 'textarea' && !e.shiftKey){
          return false;
        }
        e.stopPropagation();
        e.preventDefault();
        onSubmit(e) // Trigger submit
      }
    }
    onBlur(e) {
      e.stopPropagation(); // Prevent bubbling upwards
      this._timeoutID = setTimeout(() => {
        if (this._isManagingFocus) {
          document.body.removeEventListener("keydown",this.onKeyDown);
          document.body.removeEventListener("click",this.onClick);
          this._isManagingFocus = false;
        }
      }, 0);
    }
    onFocus(e) {
      e.stopPropagation(); // Prevent bubbling upwards
      clearTimeout(this._timeoutID);
      if (!this._isManagingFocus) {
        document.body.addEventListener("keydown",this.onKeyDown);
        document.body.addEventListener("click",this.onClick);
        this._isManagingFocus = true;
      }
    }

    render() {
     const { children } = this.props
      return (
        <div role="form" onBlur={this.onBlur} onFocus={this.onFocus}>
            {children}
        </div>
      );
    }

};
SyntheticForm.contextType = FormContext

export default SyntheticForm;
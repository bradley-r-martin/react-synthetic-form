
import React from 'react';

class SyntheticForm extends React.PureComponent {
    constructor() {
      super();
      this._timeoutID = null;
      this._isManagingFocus = false;
      this._onFocus = this._onFocus.bind(this)
      this._onBlur = this._onBlur.bind(this)
      this._onEnter = this._onEnter.bind(this)
      this._onClick = this._onClick.bind(this)
    }

    _onClick(e){
      const { onSubmit=()=>{}, onReset=()=>{} } = this.props
      const { type } = e.toElement
      if(type === 'submit'){
        onSubmit(e)  // Trigger submit
      }else if(type === 'reset'){
        onReset(e)  // Trigger reset
      }
    }
    _onEnter(e){
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
    _onBlur(e) {
      e.stopPropagation(); // Prevent bubbling upwards
      this._timeoutID = setTimeout(() => {
        if (this._isManagingFocus) {
          document.body.removeEventListener("keydown",this._onEnter);
          document.body.removeEventListener("click",this._onClick);
          this._isManagingFocus = false;
        }
      }, 0);
    }
    _onFocus(e) {
      e.stopPropagation(); // Prevent bubbling upwards
      clearTimeout(this._timeoutID);
      if (!this._isManagingFocus) {
        document.body.addEventListener("keydown",this._onEnter);
        document.body.addEventListener("click",this._onClick);
        this._isManagingFocus = true;
      }
    }

    render() {
     const { children } = this.props
      return (
        <div role="form" onBlur={this._onBlur} onFocus={this._onFocus}>
            {children}
        </div>
      );
    }

};

export default SyntheticForm;
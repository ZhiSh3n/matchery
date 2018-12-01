// IMPORT COMPONENTS
import React, { Component } from 'react';

// IMPORT STYLING
// import './Admin.css';

// COMPONENT CLASS
class DeleteJudgeModal extends React.Component {

  // Component constructor
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    }
  }

  // Render the component
  render() {

    // Return the component frame
    return (

    	<div className="modal__backdrop">
        <div className="modal modal--sm">
          <ion-icon class="modal__close-icon" name="close"></ion-icon>
          <h3 className="heading-secondary u-margin-bottom-md-lg">Remove Judge</h3>
          <form action="#">
            <p className="paragraph u-margin-bottom-hg">Are you sure you want to remove this judge?</p>
            <div className="modal__submit-area">
              <button className="modal__form-cancel">Cancel</button>
              <input type="submit" className="modal__form-delete" value="Remove"></input>
            </div>
          </form>
        </div>
      </div>

    );
  }
}

export default DeleteJudgeModal;

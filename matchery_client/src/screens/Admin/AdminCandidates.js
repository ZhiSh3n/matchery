// IMPORT COMPONENTS
import React, { Component } from 'react';

// IMPORT STYLING
// import './Admin.css';

import AdminGroupList from '../AdminGroupList';

// COMPONENT CLASS
class AdminCandidates extends React.Component {

  // Component constructor
  constructor(props) {
    super(props);
    this.adminGroupListChild = React.createRef();
    this.state = {
      candidates: [],
    }
  }

  setCandidateList = (list) => {
    this.setState({
      candidates: list,
    });
    this.adminGroupListChild.current.updateList(list);
  }

  addCandidateSuccess = (candidate) => {
    var tempGroup = this.state.candidates;
    var candidateArray = candidate.split(',');
    tempGroup.push.apply(tempGroup, candidateArray);
    this.setState({candidates: tempGroup});
    this.adminGroupListChild.current.updateList(tempGroup);
    this.update(tempGroup);
  }

  update = (list) => {
    // TODO update the list here!
  }

  deleteFromList = (e, item) => {
    var tempCandidate = this.state.candidates;
    var indexOfGroup = tempCandidate.indexOf(item);
    tempCandidate.splice(indexOfGroup, 1);
    this.setState({
      candidates: tempCandidate,
    });
    this.adminGroupListChild.current.updateList(tempCandidate);
    this.update(tempCandidate);
  }

  updateSearchInput = (e) => {
    var keyword = e.target.value;
    if (keyword.length == 0) {
      this.adminGroupListChild.current.updateList(this.state.candidates);
    } else {
      var tempGroups = this.state.candidates;
      var sendGroups = [];
      tempGroups.forEach((group) => {
        if (group.toLowerCase().includes(keyword)) {
          sendGroups.push(group);
        }
      });
      this.adminGroupListChild.current.updateList(sendGroups);
    }
  }

  // Render the component
  render() {

    // Return the component frame
    return (

    	<section className="section-candidates">

				<div className="area-search-bar-with-add u-margin-bottom-md">
					<form action="#" className="search-bar__form">
						<input
              type="text"
              className="search-bar"
              placeholder="Search candidates"
              onChange={this.updateSearchInput}
              required></input>
						<ion-icon class="search-bar__icon" name="search"></ion-icon>
					</form>
					<button
            className="btn btn--action btn--with-icon"
            onClick={(e) => {this.props.showAddCandidateModal(e)}}>
						<ion-icon class="btn__left-icon" name="add"></ion-icon>
						Add Candidates
					</button>
				</div>

				<div className="bar-group draggableList">
					<AdminGroupList
            ref={this.adminGroupListChild}
            groups={this.state.candidates}
            deleteFromList={this.deleteFromList}
          />
				</div>

			</section>

    );
  }
}

export default AdminCandidates;

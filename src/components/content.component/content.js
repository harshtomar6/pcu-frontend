import React from 'react';
import './content.css';
import Partial from './partials.component/partials';
import Modal from './partials.component/modal';


export default class Content extends React.Component{

  constructor(){
    super()

    this.state = {
      updatedData: '',
      editData: ''
    }
  }

  updateEntry(data){
    this.setState({
      updatedData: data
    })
  }

  deleteEntry(){
    this.setState({
      updatedData: Math.random()
    })
  }

  editEntry(data){
    this.setState({
      editData: data
    })
  }

  render(){

    return(
      <div id="content">
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Daily Journal" type="daily journal" deleteEntry={this.deleteEntry.bind(this)}
             editEntry = {this.editEntry.bind(this)}/>
        </div>
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Journal Entry" type="journal entry" deleteEntry={this.deleteEntry.bind(this)}/>
        </div>
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Ledger" type="ledger"/>
        </div>
        <Modal updateEntry={this.updateEntry.bind(this)} data={this.state.editData}/>
      </div>
    );
  }

}
import React from 'react';
import './content.css';
import Partial from './partials.component/partials';
import Modal from './partials.component/modal';


export default class Content extends React.Component{

  constructor(){
    super()

    this.state = {
      updatedData: ''
    }
  }

  updateEntry(data){
    this.setState({
      updatedData: data
    })
  }

  render(){

    return(
      <div id="content">
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Daily Journal" type="daily journal" data={this.state.updatedData}/>
        </div>
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Journal Entry" type="journal entry"/>
        </div>
        <div className="col-xs-12 col-md-4 col-sm-6">
          <Partial heading="Ledger" type="ledger"/>
        </div>
        <Modal updateEntry={this.updateEntry.bind(this)}/>
      </div>
    );
  }

}
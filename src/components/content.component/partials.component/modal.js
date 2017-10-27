
import React from 'react';
import './modal.css';
import Loader from './../loader';
let config = require('./../../../config');

export default class Modal extends React.Component{
  
  constructor(){
    super();

    this.state = {
      loading: false,
      description: '',
      name: '',
      credit: '',
      debit: '',
      date: new Date().toISOString().substr(0, 10)
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    let target = e.target.placeholder;

    switch(target){
      case 'Date':
        this.setState({
          date: e.target.value
        })
        break;
      case 'Description':
        this.setState({
          description: e.target.value
        })
        break;
      case 'Name':
        this.setState({
          name: e.target.value
        })
        break;
      case 'Debit Amount':
        this.setState({
          debit: e.target.value,
          credit: 0
        })
        break;
      case 'Credit Amount':
        this.setState({
          credit: e.target.value,
          debit: 0
        })
        break;
    }
  }

  handleSubmit(e){
    e.preventDefault();

    this.setState({loading: true})
    
    fetch(config.SERVER_URI+'/journal', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: this.state.date,
        name: this.state.name,
        description: this.state.description,
        debit: this.state.debit,
        credit: this.state.credit
      })
    })
    .then(result => {
      return result.json()
    })
    .then(data => {
      this.setState({loading: false})

      if(data.success){

        //Dismiss modal
        this.handleClick()

        //update entry in main page
        this.props.updateEntry({name: this.state.name,
          description: this.state.description,
          debit: this.state.debit,
          credit: this.state.credit})
      }
        
    })

  }

  handleClick(){
    document.getElementById('modal-outer').style.display = 'none';
    document.getElementById('modal-wraper').style.display = 'none';
  }

  render(){

    var showLoader = this.state.loading ? <Loader /> : ''

    return(
      <div id="modal">
      <div id="modal-outer" onClick={this.handleClick.bind(this)}></div>
        <div id="modal-wraper" className="col-xs-12 col-md-4 col-sm-6">
          <div id="modal-header">
            <p className="text-center">Add</p>
            <p className="cross" onClick={this.handleClick.bind(this)}>&times;</p>
          </div>
          <div id="modal-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="radio-wraper">
                <label className="radio-inline">
                  <input type="radio" name="type" value="Cash Account"/>Cash Account
                </label>
                <label className="radio-inline">
                  <input type="radio" name="type" value="Bank Account"/>Bank Account
                </label>
                <label className="radio-inline">
                  <input type="radio" name="type" value="None" checked/>None
                </label>
              </div>
              <input type="date" className="form-control" placeholder="Date" onChange={this.handleChange} 
                value={this.state.date} required />
              <input type="text" placeholder="Description" className="form-control" onChange={this.handleChange} 
                value={this.state.description} required />
              <input type="text" placeholder="Name" className="form-control" onChange={this.handleChange} 
                value={this.state.name} required />
              <input type="number" placeholder="Debit Amount" className="form-control" style={{marginRight:5+'px'}} 
              onChange={this.handleChange} value={this.state.debit} required />
              <input type="number" placeholder="Credit Amount" className="form-control" onChange={this.handleChange} 
                value={this.state.credit} required />
              <input type="submit" value="Submit" className="btn"/>
              {showLoader}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
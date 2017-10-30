
import React from 'react';
import './modal.css';
import Loader from './../loader';
let config = require('./../../../config');

export default class Modal extends React.Component{
  
  constructor(){
    super();

    this.state = {
      loading: false,
      particular: 'Goods Sold',
      description: null,
      name: null,
      credit: null,
      debit: null,
      date: new Date().toISOString().substr(0, 10),
      typeNeeded: true,
      checked1: false,
      checked2: false,
      checked3: true,
      id: null,
      edit: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.clearData)
      if(nextProps.clearData){
        console.log(nextProps.clearData)
        this.setState({
          loading: false,
          particular: 'Goods Sold',
          description: '',
          name: '',
          credit: '',
          debit: '',
          date: new Date().toISOString().substr(0, 10),
          typeNeeded: true,
          checked1: false,
          checked2: false,
          checked3: true,
          id: null,
          edit: false
        })
      }
      else{
        this.setState({
          edit: true,
          id: nextProps.data._id,
          particular: nextProps.data.particular,
          description: nextProps.data.description,
          name: nextProps.data.name,
          credit: nextProps.data.credit,
          debit: nextProps.data.debit,
          date: new Date(nextProps.data.date).toISOString().substr(0, 10),
          typeNeeded: nextProps.data.particular === 'Goods Sold' || nextProps.data.particular === 'Goods Purchased'
        })
  
        if(nextProps.data.type === 'bank')
          this.setState({
            checked1: false,
            checked2: true,
            checked3: false
          })
        else if(nextProps.data.type === 'cash')
          this.setState({
            checked1: true,
            checked2: false,
            checked3: false
          })
   
      }   
  }

  handleChange(e){
    let target = e.target.id;
  
    switch(target){
      case 'date':
        this.setState({
          date: e.target.value
        })
        break;
      case 'particular':
        this.setState({
          particular: e.target.value,
          typeNeeded: e.target.value === 'Goods Sold' || e.target.value === 'Goods Purchased'
        })
        break;
      case 'description':
        this.setState({
          description: e.target.value
        })
        break;
      case 'name':
        this.setState({
          name: e.target.value
        })
        break;
      case 'debit':
        this.setState({
          debit: e.target.value,
          credit: 0
        })
        break;
      case 'credit':
        this.setState({
          credit: e.target.value,
          debit: 0
        })
        break;
      case 'type1':
        this.setState({
          checked1: true,
          checked2: false,
          checked3: false
        })
        break;
      case 'type2':
        this.setState({
          checked1: false,
          checked2: true,
          checked3: false
        })
        break;
      case 'type3':
        this.setState({
          checked1: false,
          checked2: false,
          checked3: true
        })
        break;

    }
  }

  handleSubmit(e){
    e.preventDefault();

    this.setState({loading: true})
    
    var radio = document.querySelector('input[type="radio"]:checked')
    var transactionType = radio ? radio.value : 'none';
    console.log(transactionType)

    var url = this.state.edit ? '/update-journal' : '/journal';
    var postData = this.state.edit ? { type: transactionType,
      id: this.state.id,
      date: this.state.date,
      name: this.state.name,
      particular: this.state.particular,
      description: this.state.description,
      debit: this.state.debit,
      credit: this.state.credit} : 
      
      { type: transactionType,
      date: this.state.date,
      name: this.state.name,
      particular: this.state.particular,
      description: this.state.description,
      debit: this.state.debit,
      credit: this.state.credit}

    fetch(config.SERVER_URI+url, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(result => {
      return result.json()
    })
    .then(data => {
      this.setState({loading: false})

      if(data.success){
        //Reset form values
        this.setState({
          particular: 'Goods Sold',
          name: '',
          description: '',
          credit: '',
          debit: ''
        })

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
    var transactionType = this.state.typeNeeded ? <div className="form-group">
                                                    <label htmlFor="type">Transaction Type</label>
                                                    <div className="radio-wraper" id="type-wraper">
                                                      <label className="radio-inline">
                                                        <input type="radio" name="type" id="type1" value="cash"
                                                        checked={this.state.checked1} onChange={this.handleChange}/>
                                                        Cash Account
                                                      </label>
                                                      <label className="radio-inline">
                                                        <input type="radio" name="type" id="type2" value="bank"
                                                        checked={this.state.checked2} onChange={this.handleChange}/>
                                                         Bank Account
                                                      </label>
                                                      <label className="radio-inline">
                                                        <input type="radio" name="type" id="type3" value="other" 
                                                        checked={this.state.checked3} onChange={this.handleChange}/>
                                                        Other
                                                      </label>
                                                    </div>
                                                  </div> : ''

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
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" className="form-control" placeholder="Date" onChange={this.handleChange} 
                  value={this.state.date} required />
              </div>
          
              <label htmlFor="particular">Particular</label>
              <select className="form-control" id="particular" onChange={this.handleChange} value={this.state.particular}>
                <option value="Goods Sold">Goods Sold</option>
                <option value="Goods Purchased">Goods Purchased</option>
                <option value="Cash Recieved">Cash Recieved</option>
                <option value="Cheque Recieved">Cheque Recieved</option>
                <option value="Cash Paid">Cash Paid</option>
                <option value="Cheque Paid">Cheque Paid</option>
                <option value="Salary Paid">Salary Paid</option>
                <option value="Cash Drawn">Cash Drawn</option>
                <option value="Expenses">Expenses</option>
              </select>
              
              {transactionType}

              <div className="form-group">
                <label htmlFor="description">Narration</label>
                <input type="text" id="description" placeholder="Narration" className="form-control"
                 onChange={this.handleChange} value={this.state.description} />
                <small id="descHelp" className="form-text text-muted">*This field is Optional</small>
              </div>
              

              <label>Name</label>
              <input type="text" id="name" placeholder="Name" className="form-control" onChange={this.handleChange} 
                value={this.state.name} required />

              <div className="form-group row">
                <div className="col-xs-6">
                  <label>Debit Amount:</label>
                  <input type="number" id="debit" placeholder="Debit Amount" className="form-control" style={{marginRight:5+'px'}} 
                  onChange={this.handleChange} value={this.state.debit} required />
                </div>
                <div className="col-xs-6">
                  <label>Credit Amount:</label>
                  <input type="number" id="credit" placeholder="Credit Amount" className="form-control" onChange={this.handleChange} 
                    value={this.state.credit} required />
                </div>
              </div>
              <input type="submit" value="Submit" className="btn"/>
            
              {showLoader}
            </form>
          </div>
        </div>
      </div>
    );
  }
}
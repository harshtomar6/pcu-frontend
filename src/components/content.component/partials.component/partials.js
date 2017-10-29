import React from 'react';
import './partials.css';
import Loader from './../loader';
let config = require('./../../../config');

export default class Partial extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      dailyJournal: null,
      journalEntry: null
    }

    this.loadData = this.loadData.bind(this);
  }

  loadData(){

    switch(this.props.type){
      case 'daily journal':
        fetch(config.SERVER_URI+'/journal')
        .then(result => {
          return result.json()
        }).then(data => {
          let journal = ''
          //If no data is present
          if(data.length === 0){
            journal = <p style={{color: 'grey', textAlign: 'center'}}>Your Entries will be shown here</p>;
          }
          else{
            journal = data.map(entry =>{
              if(entry.credit === 0) 
                return <li key={entry._id}><b>{entry.particular}</b> to <b>{entry.name}</b> of <b>&#8377;{entry.debit}</b> on <b>{new Date(entry.date).toDateString()}</b></li>
              else
                return <li key={entry._id}><b>{entry.particular}</b> from <b>{entry.name}</b> of <b>&#8377;{entry.credit}</b> on <b>{new Date(entry.date).toDateString()}</b></li>
            })
          }

          this.setState({
            dailyJournal: journal
          })
        })
        break;

      case 'journal entry':
        fetch(config.SERVER_URI+'/journal-entry')
        .then(result => {
          return result.json()
        }).then(data => {
          let journal = ''

          //If no data is present
          if(data.length === 0)
            journal = <td style={{color: 'grey', textAlign: 'center'}}>Your Entries will be shown here</td>;
          else{
            journal = data.map(entry => {
              return <tr key={entry._id}>
                  <td>{new Date(entry.date).toDateString()}</td>
                  <td>{entry.particular.split('to')[0]} <br/> to {entry.particular.split("to")[1]} <br/> ({entry.description}) </td>
                  <td>{entry.debit}</td>
                  <td><br/>{entry.credit}</td>
                </tr>
            })
          }

          this.setState({journalEntry: journal})
        })
    }

  }

  componentWillMount(){
    this.loadData()
  }

  componentWillReceiveProps(nextProps){

    this.loadData();
  }

  handleClick(){
    document.getElementById('modal-outer').style.display = 'block';
    document.getElementById('modal-wraper').style.display = 'block';
  }

  render(){
    let type = this.props.type;

    var partialBody;


    switch(type){
      case 'daily journal':
        partialBody = this.state.dailyJournal ? <ul>
            {this.state.dailyJournal}   
          </ul> : <Loader />;
        break;

      case 'journal entry':
        partialBody = this.state.journalEntry ? <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Particular</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>{this.state.journalEntry}</tbody></table> : <Loader />
        break;
      
      default:
        partialBody=<p>No Data</p>
    }

    
    /*var ;*/

    var addButton = this.props.type === 'daily journal' ? <button type="btn" className="btn" onClick={this.handleClick.bind(this)}>
    <i className="fa fa-pencil"></i> Add New</button> : <p></p>

    return (
      <div className="partial-wrap">
        <div className="partial-head">
          <p>{this.props.heading}</p>
        </div>
        <div className="partial-body">
          {partialBody}
          <br/>
          <p className="text-center">
            {addButton}
          </p>
        </div>
      </div>
    );
  }
}
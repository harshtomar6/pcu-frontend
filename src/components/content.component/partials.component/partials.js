import React from 'react';
import './partials.css';
import Loader from './../loader';
import PartialEditor from './partial-editor';
let config = require('./../../../config');

export default class Partial extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      dailyJournal: null,
      journalEntry: null,
      dailyJournalData: null
    }

    this.loadData = this.loadData.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.editEntry = this.editEntry.bind(this);
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
            this.setState({
              dailyJournalData: data  
            })
            data.reverse();
            journal = data.map(entry =>{
              if(entry.credit === 0) 
                return (
                  <li key={entry._id} id={entry._id}>
                    <div className="row">
                    <div className="col-xs-9">
                      <b>{entry.particular}</b> to <b>{entry.name}</b> of <b>&#8377;{entry.debit}</b>
                        &nbsp;on <b>{new Date(entry.date).toDateString()}</b>
                    </div>
                    <div className="col-xs-3">
                      <i className="fa fa-pencil" style={{color: '#088C6F'}} title="Edit" onClick={this.editEntry}></i>&nbsp;
                      <i className="fa fa-trash" style={{color: '#CF0A2C'}} title="Delete" onClick={this.deleteEntry}></i>
                    </div>
                    </div>
                  </li>
                )
              else
                return( 
                  <li key={entry._id} id={entry._id}>
                    <div className="row">
                    <div className="col-xs-9">
                      <b>{entry.particular}</b> from <b>{entry.name}</b> of <b>&#8377;{entry.credit}</b>
                        &nbsp;on <b>{new Date(entry.date).toDateString()}</b>
                    </div>
                    <div className="col-xs-3">
                      <i className="fa fa-pencil" style={{color: '#088C6F'}} title="Edit" onClick={this.editEntry}></i>&nbsp;
                      <i className="fa fa-trash" style={{color: '#CF0A2C'}} title="Delete" onClick={this.deleteEntry}></i>
                    </div>
                    </div>
                  </li>
                )
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
            data.reverse();
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
    window.scrollTo(0, 0);
    document.getElementById('modal-outer').style.display = 'block';
    document.getElementById('modal-wraper').style.display = 'block';

    this.props.clearData()
  }

  deleteEntry(e){
    var id = e.target.parentElement.parentElement.parentElement.id;
    
    fetch(config.SERVER_URI+'/delete-journal', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(result => {return result.json()})
    .then(data => {
      this.props.deleteEntry();
    })
  }

  editEntry(e){
    var id = e.target.parentElement.parentElement.parentElement.id
    
    var data = this.state.dailyJournalData[this.state.dailyJournalData.findIndex(entry => { return entry._id == id })]

    this.props.editEntry(data)
    document.getElementById('modal-outer').style.display = 'block';
    document.getElementById('modal-wraper').style.display = 'block';
  }

  render(){
    let type = this.props.type;

    var partialBody, partialBottom;

    switch(type){
      case 'daily journal':
        partialBody = this.state.dailyJournal ? <div><ul>
            {this.state.dailyJournal}   
          </ul><br/>
          </div> : <Loader />;

        partialBottom = <p className="text-center">
            <button type="btn" className="btn" onClick={this.handleClick.bind(this)}>
              <i className="fa fa-pencil"></i> Add New
            </button>
          </p>
        break;

      case 'journal entry':
        partialBody = this.state.journalEntry ? <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Particular</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>{this.state.journalEntry}</tbody></table> : <Loader />
          partialBottom='';
        break;
      
      default:
        partialBody=<p>No Data</p>
    }

    return (
      <div className="partial-wrap">
        <div className="partial-head">
          <p>{this.props.heading}</p>
        </div>
        <div className="partial-body">
          {partialBody}
        </div>
        <div className="partial-bottom">
          {partialBottom}
        </div>
      </div>
    );
  }
}
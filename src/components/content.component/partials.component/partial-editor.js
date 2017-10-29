import React from 'react';
import './partial-editor.css';
import Loader from './../loader';
const config = require('./../../../config');

export default class PartialEditor extends React.Component{

  constructor(){
    super();

    this.state = {
      data: null,
      loading: true
    }
  }

  handleClick(){

  }

  componentWillMount(){
    fetch(config.SERVER_URI+'/journal')
    .then(result => {return result.json()})
    .then(data => {

      var entries = data.map(entry => {
        if(entry.credit === 0) 
          return <li key={entry._id}>
                    <input type="text" value={entry.particular}/> to <b>{entry.name}</b> of <b>&#8377;{entry.debit}</b> on <b>{new Date(entry.date).toDateString()}</b></li>
        else
          return <li key={entry._id}><b>{entry.particular}</b> from <b>{entry.name}</b> of <b>&#8377;{entry.credit}</b> on <b>{new Date(entry.date).toDateString()}</b></li>
      })

      this.setState({data: entries, loading: false})

    })
  }

  render(){

    var showLoader = this.state.loading ? <Loader />: '';

    return(
      <div>
        {showLoader}
        <ul>
          {this.state.data}
        </ul>
        <br/>
        <p className="text-center">
          <button type="btn" className="btn" onClick={this.handleClick.bind(this)}>
            <i className="fa fa-tick"></i> Update
          </button>
        </p>
      </div>
    )
    
  }

}
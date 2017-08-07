import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';


export default class MultiSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: this.props.options,
      value: this.props.value,
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)

  }
  handleSelectChange (value) {
    console.log('You\'ve selected:', value);
    this.setState({ value });
  }
  render () {
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>
        <Select multi value={this.state.value} placeholder="testing" options={this.props.options} onChange={this.handleSelectChange} />
      </div>
    );
  }
}

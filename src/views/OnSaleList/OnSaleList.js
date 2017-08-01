import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { onSaleRef } from '../../config'
import React, { Component } from 'react'
import moment from 'moment'
import ReactToolTip from 'react-tooltip'
import { Link } from 'react-router-dom'
import { eliminateDuplicates } from '../../utils'

class OnSaleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      onSaleItems: [],
      count:1000,
      year:'2017',
      startTime: '7:00 AM',
      startIndex: 0,
      endIndex:10,
      query: '',
      recommendedBuys: {},
      showDetailModal: false,
      itemBeingEdited: null,
      itemChanges: {},
      selectedItem: null,
      editing:false
    }
    this.fetchOnSaleList = this.fetchOnSaleList.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.filterItems = this.filterItems.bind(this)
    this.paginate = this.paginate.bind(this)
    this.toggle = this.toggle.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.handleStartTime = this.handleStartTime.bind(this)
  }
  componentDidMount() {
    this.fetchOnSaleList()
    onSaleRef.on('child_changed', s => {
      console.log('child changed', s.val())
      this.setState({
        onSaleItems: [...this.state.onSaleItems, Object.assign({}, {id: s.key}, s.val())]
      })
    })
  }

  handleClick() {
    this.setState({
      count: this.state.count + 10
    })
    setTimeout(() => this.fetchOnSaleList(), 2000)
  }

  handleStartTime(e) {
    console.log('new start time', e.target.value)
    this.setState({
      startTime: e.target.value
    })
    setTimeout(() => this.fetchOnSaleList(), 1000)
  }
  componentWillUnMount() {
    onSaleRef.off()
  }
  fetchOnSaleList() {
    console.log('fetching items')
    let onSaleItems = []
    onSaleRef.orderByChild('onSaleTime').equalTo(this.state.startTime).limitToFirst(100).once('value', s => {
      if(s.exists()) {
        Object.keys(s.val()).map(k => {
          onSaleItems.push(Object.assign({},s.val()[k], {id:k}))
        })
      }
    }).then(() => {
      this.setState({
        loading:false,
        onSaleItems
      })
    })
  }

  filterItems() {
    const regex = new RegExp(this.state.query, 'gi')
    if (this.state.query.length < 3)
      return this.state.onSaleItems
    if('recommended'.match(regex)) {
      return this.state.onSaleItems.filter((item, index) => {
        return item.reccommended === true
      })
    }
    return this.state.onSaleItems.filter((t, index) =>
      (t.venue.match(regex)) ||
      t.eventName.match(regex) ||
      t.city.match(regex)


    )
  }

  toggle(item) {
    console.log(`toggle called with`, item)
    this.setState({
      showDetailModal: !this.state.showDetailModal,
      selectedItem: item
    })

  }

  toggleEdit(item) {
    let _this = this
    if(
      this.state.itemBeingEdited &&
      Object.keys(this.state.itemChanges).length > 0
      ) {
      console.log('saving changes for item', item.id)
      let itemId = this.state.itemBeingEdited.id
      onSaleRef.child(this.state.itemBeingEdited.id).update(Object.assign(this.state.itemChanges[this.state.itemBeingEdited.id], {reccommended:true, reccommendedBy: localStorage.getItem('firstName')}), () => {
        this.setState({
          editing: false,
          showDetailModal: false,
          itemBeingEdited: false,
          itemChanges: {},
          recommendedBuys: Object.assign({}, this.state.recommendedBuys, {[itemId]:true})
        })
      })
    }
    this.setState({
      editing:!this.state.editing,
      showDetailModal: !this.state.showDetailModal,
      itemBeingEdited: this.state.itemBeingEdited ? null: item
    })
  }

  paginate() {
    this.setState({
      count: this.state.count+10,
      loading:true
    })
    setTimeout(() => this.fetchOnSaleList(), 2000)
  } 

  render() {
    const onSaleTableStyle = {
      'tableLayout':'fixed'
    }
    const spanStyles = {
      fontSize: '11px'
    }
    const buildModalBody = () => {
      if(this.state.editing === true) {
        return (
          <form className='form-horizontal'>
            <div className="form-group row">
              <label className='col-md-3 form-control-label'><i className='fa fa-hashtag'/> Ticket To Purchase</label>
              <div className='col-md-9'>
                <input type="text" onChange={(e) => this.setState({itemChanges: {[this.state.itemBeingEdited.id]: Object.assign({}, this.state.itemChanges[this.state.itemBeingEdited.id], {numTicketsToBuy:e.target.value})}})} id="numTickets" name="numTickets" className="form-control" placeholder="42"/>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-3 form-control-label"  htmlFor="textarea-input"><i className='fa fa-comments'/> Additional comments</label>
              <div className="col-md-9">
                <textarea id="textarea-input"  onChange={(e) => this.setState({itemChanges: {[this.state.itemBeingEdited.id]: Object.assign({}, this.state.itemChanges[this.state.itemBeingEdited.id], {additionalComments:e.target.value})}})} name="textarea-input" rows="9" className="form-control" placeholder="Content.."></textarea>
              </div>
            </div>
          </form>
        )
      }
      else if(this.state.selectedItem) {
        return (
          <div>
            <h4> <span className='text-muted'> Recommended by:</span> {this.state.selectedItem.reccommendedBy} </h4>
            <h4> <span className='text-muted'> Num Tickets To Buy:</span> {this.state.selectedItem.numTicketsToBuy} </h4>
            <h4> <span className='text-muted'> Additional Comments:</span> {this.state.selectedItem.additionalComments} </h4>
          </div>
        )
      }
    }
    const buildModalHeading = () => {
      if(this.state.editing === true) {
        return (
          <div className='modal-title'> <i className='fa fa-thumbs-up'> </i> Recommend this item</div>
        )
      }
      else {
         return (
           <div> <i className='fa fa-question-circle'> </i> Details</div>
        )
      }
    }
    let providers = eliminateDuplicates(this.state.onSaleItems.map(item => item.provider))
    let tableHeaders = []
    providers.forEach(provider => {
      let keys = Object.keys(this.state.onSaleItems.filter(item => item.provider === provider)[0])
      keys.forEach(k => {
        if(k !== 'id' && k !== 'numTicketsToBuy' && k !== 'reccommended' && k !== 'additionalComments' && k !== 'reccommendedBy') {
          if(tableHeaders.indexOf(k) === -1) 
            tableHeaders.push(k)
        }
      })
      //tableHeaders.push(Object.keys(this.state.onSaleItems.filter(item => item.provider === provider)[0]))
    })
    eliminateDuplicates(tableHeaders)
    let onSaleItems = this.filterItems()
    .sort((a,b) => moment(a.onSaleDate) - moment(b.onSaleDate))
    .sort((a, b) => +a.onSaleTime.split(' ')[0].split(':')[0] - +b.onSaleTime.split(' ')[0].split(':')[0])
    .map((item, index) => {
      if(this.state.recommendedBuys[item.id] !== undefined || item.reccommended !== undefined) {
        return (
             <tr key={index} onClick={() => this.toggle(item)}>
                <td> {item['eventName']} 
                  <br></br>
                  <Link to={`/socialData/${item.eventName}`} activeClassName='active' data-for='test' data-tip='View Social Data'>
                    <ReactToolTip id='test'/>
                    <i className='fa fa-info-circle' style={{cursor:'pointer'}}/> 
                  </Link>
                </td> 
              {Object.keys(item).map(k => {
                if(k !== 'My Notes' && 
                  k !== 'eventName' && 
                  k !== 'publicSaleUrl' && 
                  k !== 'ticketLink' && 
                  k !=='provider' && 
                  k !== 'id' &&
                  k !== 'reccommended' &&
                  k !== 'reccommendedBy' && 
                  k !== 'numTicketsToBuy' && 
                  k !== 'additionalComments'
                  ) {
                  return (<td key={k}> {item[k]} </td>)
                }
              })}
              <td> 
                <a className='btn btn-success' target='_blank' href={item.provider === 'Stublr' ? item.publicSaleUrl: item.ticketLink} style={{color:'white'}}> Buy tickets </a>
              </td>
              <td><span className='badge badge-primary badge-thick'>recommended</span></td>
          </tr>
        )
      }
      return (
        <tr key={index} onClick={() => this.toggleEdit(item)}>
            <td> {item['eventName']} 
              <br></br>
              <Link to={`/socialData/${item.eventName}`} activeClassName='active' data-for='test' data-tip='View Social Data'>
                <ReactToolTip id='test'/>
                <i className='fa fa-info-circle' style={{cursor:'pointer'}}/> 
              </Link>
            </td> 
          {Object.keys(item).map(k => {
            if(k !== 'My Notes' && 
                  k !== 'eventName' && 
                  k !== 'publicSaleUrl' && 
                  k !== 'ticketLink' && 
                  k !=='provider' && 
                  k !== 'id' &&
                  k !== 'reccommended' &&
                  k !== 'reccommendedBy' && 
                  k !== 'numTicketsToBuy' && 
                  k !== 'additionalComments'
                  ) {
              return (<td key={k}> {item[k]} </td>)
            }
          })}
          <td> <a className='btn btn-success btn-sm' target='_blank' href={item.provider === 'Stublr' ? item.publicSaleUrl: item.ticketLink} style={{color:'white'}}> Buy tickets </a></td>
          <td></td>

        </tr>
      )
    })

    if(this.state.loading) {
      return (
        <div className='row'> 
          fetching onsale list...
        </div>)
    }
    
    return (
      <div className='animated fadeIn'>
        <div className='row'>
          <Modal isOpen={this.state.showDetailModal} toggle={this.state.editing ? this.toggleEdit: this.toggle} className={this.props.classname}>
            <ModalHeader toggle={this.state.editing ? this.toggleEdit: this.toggle}>
              {buildModalHeading()}
            </ModalHeader>
            <ModalBody>
              {buildModalBody()}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.state.editing ? this.toggleEdit: this.toggle}>Done</Button>{' '}
              <Button color="secondary" onClick={this.state.editing ? this.toggleEdit: this.toggle}>Close</Button>
            </ModalFooter>
        </Modal>
          <div className='col-lg-12'>
            <div className='card'>
              <div className='card-block'>
              <div className='form-group col-sm-4'> 
                <div className='input-group'> 
                  <span className='input-group-addon'> Filter </span>
                  <input placeholder='type something to filter events' className='form-control' onChange={(e) => this.setState({query:e.target.value})} value={this.state.query}/> 
                </div>

              </div>
              <div className='form-group col-sm-4'> 
                <div className='input-group'> 
                  <span className='input-group-addon'> Start Time </span>
                  <select onChange={this.handleStartTime} className='form-control col-sm-2' > 
                  <option> 7:00 AM </option>
                  <option> 8:00 AM </option>
                  <option> 9:00 AM </option>
                  <option> 10:00 AM </option>
                  <option> 11:00 AM </option>
                  <option> 12:00 PM </option>
                  <option> 1:00 PM </option>
                  <option> 2:00 PM </option>
                  <option> 3:00 PM </option>
                  <option> 4:00 PM </option>
                  <option> 5:00 PM </option>
                  <option> 6:00 PM </option>
                  <option> 7:00 PM </option>
                  <option> 8:00 PM </option>
                  <option> 9:00 PM </option>
                  <option> 10:00 PM </option>
                  <option> 11:00 PM </option>
                  <option> 12:00 AM</option>
                </select>
                </div>
              </div>
              <span className='badge badge-success'> Showing {this.state.onSaleItems.length}</span>
              <table style={onSaleTableStyle} className='table table-bordered table-striped table-sm'> 
                <thead> 
                  <tr>
                  <th> Event Name </th>
                    {tableHeaders.map((k, index) => {
                      if(k !== 'My Notes' && k !== 'publicSaleUrl' && k !=='ticketLink' && k !== 'eventName' && k !=='provider')
                      return (<th key={index}>{k}</th> )
                    })}
                    <th> purchase </th>
                    <th> notes </th>
                  </tr>
                </thead>
                <tbody>
                  {onSaleItems} 
                </tbody>
              </table>
            </div>
            </div>
        </div>
      </div>
    </div>
    )
  }
}

export default OnSaleList


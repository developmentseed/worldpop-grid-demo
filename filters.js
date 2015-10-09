var React = require('react/addons')
var filters = require('oam-browser-filters')
var Dropdown = require('./dropdown')

module.exports = React.createClass({
  getInitialState: function () {
    return {
      date: 'all',
      resolution: 'all',
      dataType: 'all'
    }
  },

  propTypes: {
    onChange: React.PropTypes.func
  },

  update: function () {
    var filter = filters.getCombination(this.state.date, this.state.resolution, this.state.dataType)
    this.props.onChange(filter)
  },

  setDate: function (d) {
    this.setState({date: d.key}, this.update)
  },

  setResolution: function (d) {
    this.setState({resolution: d.key}, this.update)
  },

  setDataType: function (d) {
    this.setState({dataType: d.key}, this.update)
  },

  render: function () {
    function filterItem (property, clickHandler, d) {
      var klass = this.state[property] === d.key ? 'active' : ''
      var click = clickHandler.bind(this, d)
      return (
        <dd key={property + '-filter-' + d.key} className={klass}>
          <a onClick={click} title={d.title}>{d.title}</a>
        </dd>)
    }

    var dates = [
      {key: 'all', title: 'All'},
      {key: 'week', title: 'Last week'},
      {key: 'month', title: 'Last month'},
      {key: 'year', title: 'Last year'}
    ].map(filterItem.bind(this, 'date', this.setDate))

    var resolutions = [
      {key: 'all', title: 'All'},
      {key: 'low', title: 'Low'},
      {key: 'medium', title: 'Medium'},
      {key: 'high', title: 'High'}
    ].map(filterItem.bind(this, 'resolution', this.setResolution))

    var dataTypes = [
      {key: 'all', title: 'All Images'},
      {key: 'service', title: 'Image + Map Layer'}
    ].map(filterItem.bind(this, 'dataType', this.setDataType))

    return (
      <Dropdown element='li' className='drop dropdown center' triggerTitle='Settings' triggerClassName='bttn-settings' triggerText='Settings'>
        <dl className='drop-menu filters-options-menu' role='menu'>
          <dt className='drop-menu-sectitle'>Time</dt>
          {dates}
          <dt className='drop-menu-sectitle'>Resolution</dt>
          {resolutions}
          <dt className='drop-menu-sectitle'>Data Type</dt>
          {dataTypes}
        </dl>
      </Dropdown>
    )
  }
})

var React = require('react')

var Dropdown = React.createClass({
  getDefaultProps: function () {
    return {
      element: 'div',
      className: '',

      triggerTitle: '',
      triggerClassName: '',
      triggerText: ''
    }
  },

  getInitialState: function () {
    return {
      open: false
    }
  },

  componentDidMount: function () {
  },

  componentWillUnmount: function () {
  },

  closeDropdown: function (e) {
    e.preventDefault()
    this.setState({ open: !this.state.open })
  },

  render: function () {
    var klasses = ['drop']
    if (this.state.open) {
      klasses.push('open')
    }
    if (this.props.className) {
      klasses.push(this.props.className)
    }

    return (
      <this.props.element className={klasses.join(' ')} data-hook='dropdown'>
        <a href='#' title={this.props.triggerTitle} className={this.props.triggerClassName} onClick={this.closeDropdown}><span>{this.props.triggerText}</span></a>
        <div className='drop-content'>
          {this.props.children}
        </div>
      </this.props.element>
    )
  }
})

module.exports = Dropdown

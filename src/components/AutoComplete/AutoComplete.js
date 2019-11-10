import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './AutoComplete.css'

const NO_RESULTS_STRING = 'Not found!';

export default class AutoComplete extends PureComponent {
  static defaultProps = {
    loading: false,
    value: null,
    error: false,
    options: [],
    noResultsText: NO_RESULTS_STRING,
  };
  static propTypes = {
    onInputChange: PropTypes.func,
    onChange: PropTypes.func.isRequired,

    // Optional
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    options: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    noResults: PropTypes.string,
  };
  state = {
    input: '',
    inputFocused: false,
  };
  handleInputChange = ({target: {value}}) => {
    const {onInputChange} = this.props;
    this.setState(
      () => ({input: value}),
      (onInputChange && value.length > 0 ? () => onInputChange(value) : null),
    );
  };
  handleClick = value => () => {
    const {onChange, options} = this.props;
    const option = options.find(o => o.value === value);
    this.setState(
      () => ({input: option.label, inputFocused: false}),
      (onChange ? () => onChange(value) : null),
    );
  };
  onBlur = () => this.setState({inputFocused: false});
  onFocus = () => this.setState({inputFocused: true});
  getOptions() {
    const {options} = this.props
    const {input} = this.state;
    if (input.length > 0) {
      return options.filter(({label}) => label.toLowerCase().includes(input.toLowerCase()))
    }
    return options;
  }
  render() {
    const {loading, error} = this.props;
    const {input, inputFocused} = this.state;
    const options = this.getOptions();
    return (
      <div className="my-auto-complete">
        <div className={`my-auto-complete__input-field${error ? '--error' : ''}`}>
          <input
            className="my-auto-complete__input"
            placeholder="Search"
            onChange={this.handleInputChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            value={input}
          />
          <div className="my-auto-complete__status">
            {loading && <i className="fa fa-spinner fa-spin" />}
          </div> 
        </div>
        {(inputFocused && input.length > 0 && !error && !loading) && (
          <div className="my-auto-complete__dropdown">
            {options.length > 0
              ? (
                <ul className="my-auto-complete__list">
                  {options.map(({label, value}) => (
                    <li className="my-auto-complete__list-item" key={value} onMouseDown={this.handleClick(value)}>{label}</li>
                  ))}
                </ul>
              )
              : this.props.noResultsText
            }
          </div>
        )}
      </div>
    );
  }
}

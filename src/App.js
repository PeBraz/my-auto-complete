import React, {PureComponent} from 'react';
import AutoComplete from './components/AutoComplete';
import './App.css';

const API_ENDPOINT = 'https://api.github.com';
const REQUEST_WAIT = 250; // ms;

async function requestSearchGithubRepositories(query) {
  const response = await fetch(
    `${API_ENDPOINT}/search/repositories?q=${encodeURIComponent(query.trim())}&sort=stars&order=desc`,
  );
  const body = await response.json();
  if (body && Array.isArray(body.items)) {
    return body.items;
  }
  return [];
}

class App extends PureComponent {
  requestOnHold = null;
  state = {
    value: null,
    options: [],
    loading: false,
  };
  requestGithub = value => {
    this.setState({options: [], loading: true, error: false});
    if (this.requestOnHold) {
      clearTimeout(this.requestOnHold);
    }
    this.requestOnHold = setTimeout(async () => {
      try {
        const items = await requestSearchGithubRepositories(value);
        this.setState({
          loading: false,
          options: items.map(({id, full_name, description}) => ({
            label: full_name,
            value: id,
            description
          })),
        });
      } catch (e) {
        this.setState({error: true, options: [], loading: false})
      } 
    }, REQUEST_WAIT);
  };
  render() {
    const {value, options, loading} = this.state;
    return (
      <div className="app">
        <AutoComplete
          value={value}
          options={options}
          loading={loading}
          onInputChange={text => this.requestGithub(text)}
          onChange={newValue => this.setState({value: newValue})}
        />
      </div>
    );
  }
}

export default App;

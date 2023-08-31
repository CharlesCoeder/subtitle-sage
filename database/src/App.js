import React, { useRef, useState } from 'react';
import './App.css';
import { Q } from '@nozbe/watermelondb'

function App({database}) {
  const [term, setTerm] = useState("");

  const handleInputChange = (event) => {
    setTerm(event.target.value);
  }

  const searchInput = useRef(null);
  
  async function handleSearch() {
    const start = performance.now();
    const matches = await database.collections.get('termBank').query(Q.where('termText', searchInput.current.value)).fetch();
    console.log('\n\n-----------------------------------------')
    console.log('------ SEARCHING FOR ', searchInput.current.value, ' -------')
    console.log('-----------------------------------------')

  
    matches.forEach(match => {
      try {
        let definitions = match.definitions;
        if(Array.isArray(definitions)) {
          definitions.forEach(def => console.log(def));
        } else {
          console.error('Definitions are not in expected format');
          console.log(typeof definitions);
        }
      } catch (error) {
        console.error('Error with definitions', error);
      }
    });
    
    
  
    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Search took ${timeTaken} ms`);
  }
  
  
  

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input ref={searchInput} type="text" value={term} onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

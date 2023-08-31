import React, { useRef, useState } from 'react';
import './App.css';
import { Q } from '@nozbe/watermelondb'
import kuromoji from 'kuromoji';

function App({database}) {
  const [term, setTerm] = useState("");
  const [tokenizeTerm, setTokenizeTerm] = useState("");

  const handleInputChange = (event) => {
    setTerm(event.target.value);
  }

  const handleTokenInputChange = (event) => {
    setTokenizeTerm(event.target.value);
  }

  const searchInput = useRef(null);
  const tokenizeSearchInput = useRef(null);
  
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

  async function handleTokenizeSearch(){

    const sentence = tokenizeSearchInput.current.value;

    kuromoji.builder({ dicPath: "/dict/" }).build(async (err, tokenizer) => {
      if (err) {
        throw err;
      }
    
      // Tokenize the sentence
      const tokens = tokenizer.tokenize(sentence);
    
      // Log the tokens
      console.log(tokens);

      let separated = "";

    
      for (const x of tokens){
        const term = x.basic_form;

        separated += " | " + term;

        const matches = await database.collections.get('termBank').query(Q.where('termText', term)).fetch();
        console.log('\n\n-----------------------------------------')
        console.log('------ SEARCHING FOR ', term, ' -------')
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
          } 
          
          catch (error) {
            console.error('Error with definitions', error);
          }
        });
      }
      console.log(separated);
    })
  }
  
  
  

  return (
    <div className="App">
      <header className="App-header">
        <h3>Search Individual Term</h3>
        <input ref={searchInput} type="text" value={term} onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
        <h3>Tokenize Sentence & Search Each Word</h3>
        <input ref={tokenizeSearchInput} type="text" value={tokenizeTerm} onChange={handleTokenInputChange} />
        <button onClick={handleTokenizeSearch}>Tokenize & Search</button>
        <p>
          *Open console to see output*
        </p>
      </header>
    </div>
  );
}

export default App;

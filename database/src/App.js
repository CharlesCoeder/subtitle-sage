import React, { useRef, useState } from "react";
import "./App.css";
import { Q } from "@nozbe/watermelondb";
import kuromoji from "kuromoji";

function App({ database, handleClick }) {
  const [term, setTerm] = useState("");
  const [tokenizeTerm, setTokenizeTerm] = useState("");

  const handleInputChange = (event) => {
    setTerm(event.target.value);
  };

  const handleTokenInputChange = (event) => {
    setTokenizeTerm(event.target.value);
  };

  const searchInput = useRef(null);
  const tokenizeSearchInput = useRef(null);

  async function searchForTerm(term) {
    const start = performance.now();
    const matches = await database.collections
      .get("termBank")
      .query(Q.where("term_text", term))
      .fetch();
    console.log("\n\n-----------------------------------------");
    console.log("------ SEARCHING FOR ", searchInput.current.value, " -------");
    console.log("-----------------------------------------");

    for (const match of matches) {
      try {
        let definitions = match.definitions;
        if (Array.isArray(definitions)) {
          definitions.forEach((def) => console.log(def));
        } else {
          console.error("Definitions are not in expected format");
          console.log(typeof definitions);
        }

        const relatedTagRelations = await database.collections
          .get("termTagRelations")
          .query(Q.where("term_id", match.id))
          .fetch();

        const relatedTagsPromises = relatedTagRelations.map(
          async (relation) => {
            const tag = await database.collections
              .get("tagBank")
              .find(relation.tag_id);
            return tag.tag_name;
          }
        );

        const relatedTags = await Promise.all(relatedTagsPromises);

        console.log(
          `Tags associated with term ${match.term_text}:`,
          relatedTags.join(", ")
        );
      } catch (error) {
        console.error("Error fetching related tags for term", error);
      }
    }

    const end = performance.now();
    const timeTaken = end - start;
    console.log(`Search took ${timeTaken} ms`);
  }

  async function handleSearch() {
    searchForTerm(searchInput.current.value);
  }

  async function handleTokenizeSearch() {
    const sentence = tokenizeSearchInput.current.value;

    kuromoji.builder({ dicPath: "/dict/" }).build(async (err, tokenizer) => {
      if (err) {
        throw err;
      }

      // tokenize sentence
      const tokens = tokenizer.tokenize(sentence);

      // string that will show separated tokens in a readable way
      let separated = "";

      for (const x of tokens) {
        const term = x.basic_form;
        separated += " | " + term;
        searchForTerm(term);
      }
      console.log(separated);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Search Individual Term</h3>
        <input
          ref={searchInput}
          type="text"
          value={term}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
        <h3>Tokenize Sentence & Search Each Word</h3>
        <input
          ref={tokenizeSearchInput}
          type="text"
          value={tokenizeTerm}
          onChange={handleTokenInputChange}
        />
        <button onClick={handleTokenizeSearch}>Tokenize & Search</button>
        <p>*Open console to see output*</p>
        <button onClick={handleClick}>Import Dictionary</button>
      </header>
    </div>
  );
}

export default App;

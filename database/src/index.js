import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {Database, Q} from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import schema from './model/schema';
import termBank from './model/termBank';

// WatermelonDB setup
const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

 const database = new Database({
    adapter,
    modelClasses: [termBank],
    actionsEnabled: true,
  });


  // import function
  async function importDictionary(dictionaryFolderPath) {
    console.log("Starting import...");
    let i = 1;
    const termBankCollection = database.collections.get('termBank');
  
    while (true) {
      const filePath = `${dictionaryFolderPath}/term_bank_${i}.json`;
      const fileContentsResponse = await fetch(filePath);
  
      if (!fileContentsResponse.ok || !fileContentsResponse.headers.get("content-type").includes("application/json")) {
        break;
      }
  
      const entries = await fileContentsResponse.json();
      console.log(i);
  
      for (const entry of entries) {
        await database.write(async () => {
          const existingRecords = await termBankCollection.query(
            Q.where('termText', entry[0]),
            Q.where('sequenceNum', entry[6])
          ).fetch();
  
          if (existingRecords.length === 0) {
            await database.batch(
              termBankCollection.prepareCreate(record => {
                record.termText = entry[0];
                record.reading = entry[1];
                record.defTags = entry[2];
                record.rules = entry[3];
                record.score = entry[4];
                record.definitions = JSON.stringify(entry[5]);
                record.sequenceNum = entry[6];
                record.termTags = entry[7];
              })
            );
            console.log(`Data written for termText: ${entry[0]} and sequenceNum: ${entry[6]}. Definitions: ${entry[5]}`);
          } else {
            // console.log(`Entry with termText: ${entry[0]} and reading: ${entry[1]} already exists. Skipping.`);
          }
          // console.log(entry[5]);
          // console.log(typeof entry[5]);
        });
      }
  
      i++;
    }
    console.log("Import completed");
  }
  


async function start() {
  importDictionary("/jmdict_english").then(() => {
    console.log('hey')
  })
}

start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App database={database}/>
  </React.StrictMode>
);

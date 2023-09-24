import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {Database, Q} from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import schema from './model/schema';
import termBank from './model/termBank';
import JSZip from 'jszip';

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
  
  // This function will open a file selector to unzip & import a dictionary
  const handleClick = async () => {
    console.log('clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip'; // Only accept .zip files
  
    input.addEventListener('change', async (event) => {
      const file = event.target.files[0]; // Get the selected file
  
      if (file) {
        // Create a FileReader object to read the file
        const reader = new FileReader();
        
        // Add an event listener to handle file read
        reader.addEventListener('load', async () => {
          const zip = new JSZip();
          const contents = await zip.loadAsync(reader.result);
          const fileArray = [];
  
          // Iterate through each file and perform actions
          for (const filename of Object.keys(contents.files)) {
            if (!contents.files[filename].dir) { // Skip directories
              const fileData = await contents.file(filename).async('string'); // Use 'uint8array' for binary files
              console.log(`File: ${filename}`);
              fileArray.push({ filename, content: fileData });
            }
          }
  
          // Now we have a fileArray that can be used for import
          if (fileArray.length > 0) {
            // Here, call your importDictionary function
            await importDictionary(fileArray);
          }
        });
        
        // Read the file as ArrayBuffer
        reader.readAsArrayBuffer(file);
      }
    });
  
    input.click();
  };


  // Dictionary import function
  // fileArray is an array of { fileName, content } for every file in the zipped dictionary archive
  async function importDictionary(fileArray) {
    console.log("Starting import...");
    const termBankCollection = database.collections.get('termBank');
  
    for (const fileObj of fileArray) {
      const { filename, content } = fileObj;
  
      // Check if it's a JSON file and matches the filename pattern
      if (!filename.includes('.json') || !filename.startsWith('term_bank_')) {
        console.log(`Skipping file ${filename} as it doesn't match the expected pattern.`);
        continue;
      }
  
      let entries;
      try {
        entries = JSON.parse(content);
      } catch (e) {
        console.error(`Error parsing JSON from file ${filename}: ${e}`);
        continue;
      }
  
      console.log(`Processing ${filename}...`);
  
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
            // Existing entry, do nothing
          }
        });
      }
    }
    console.log("Import completed");
  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App database={database} handleClick={handleClick}/>
  </React.StrictMode>
);

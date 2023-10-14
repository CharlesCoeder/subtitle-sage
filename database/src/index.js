import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Database, Q } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import schema from "./model/schema";
import termBank from "./model/termBank";
import tagBank from "./model/tagBank";
import TermTagRelations from "./model/termTagRelations";
import JSZip from "jszip";

// WatermelonDB setup
const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

const database = new Database({
  adapter,
  modelClasses: [termBank, tagBank, TermTagRelations],
  actionsEnabled: true,
});

// This function will open a file selector to unzip & import a dictionary
const handleClick = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".zip"; // Only accept .zip files

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Create a FileReader object to read the file
      const reader = new FileReader();

      // Add an event listener to handle file read
      reader.addEventListener("load", async () => {
        const zip = new JSZip();
        const contents = await zip.loadAsync(reader.result);
        const fileArray = [];

        // Iterate through each file and perform actions
        for (const filename of Object.keys(contents.files)) {
          if (!contents.files[filename].dir) {
            // Skip directories
            const fileData = await contents.file(filename).async("string"); // Use 'uint8array' for binary files
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

async function importDictionary(fileArray) {
  console.log("Starting import...");
  const termBankCollection = database.collections.get("termBank");
  const tagBankCollection = database.collections.get("tagBank");
  const termTagRelationsCollection =
    database.collections.get("termTagRelations");

  for (const fileObj of fileArray) {
    const { filename, content } = fileObj;
    if (filename.startsWith("tag_bank_")) {
      let entries;

      if (!filename.endsWith(".json")) {
        console.log(`Skipping file ${filename} as it's not a JSON file.`);
        continue;
      }

      try {
        entries = JSON.parse(content);
      } catch (e) {
        console.error(`Error parsing JSON from file ${filename}: ${e}`);
        continue;
      }

      console.log(`Processing tag bank file ${filename}...`);
      for (const entry of entries) {
        await database.write(async () => {
          const existingRecords = await tagBankCollection
            .query(Q.where("tag_name", entry[0]))
            .fetch();
          if (existingRecords.length === 0) {
            await tagBankCollection.create((record) => {
              record.tag_name = entry[0];
              record.category = entry[1];
              record.sort_order = entry[2];
              record.notes = entry[3];
              record.score = entry[4];
            });
          }
        });
      }
    }
  }

  for (const fileObj of fileArray) {
    const { filename, content } = fileObj;
    if (filename.startsWith("term_bank_")) {
      let entries;
      if (!filename.endsWith(".json")) {
        console.log(`Skipping file ${filename} as it's not a JSON file.`);
        continue;
      }

      try {
        entries = JSON.parse(content);
      } catch (e) {
        console.error(`Error parsing JSON from file ${filename}: ${e}`);
        continue;
      }

      console.log(`Processing term bank file ${filename}...`);

      for (const entry of entries) {
        let insertedTerm;
        await database.write(async () => {
          const existingRecords = await termBankCollection
            .query(
              Q.where("term_text", entry[0]),
              Q.where("sequence_num", entry[6])
            )
            .fetch();

          // if record does not yet exist, create it
          if (existingRecords.length === 0) {
            insertedTerm = await termBankCollection.create((record) => {
              record.term_text = entry[0];
              record.reading = entry[1];
              record.def_tags = entry[2];
              record.rules = entry[3];
              record.score = entry[4];
              record.definitions = JSON.stringify(entry[5]);
              record.sequence_num = entry[6];
              record.term_tags = entry[7];
            });

            const tagNames = entry[2].split(" "); // Assuming tags are space-separated
            for (const tagName of tagNames) {
              const existingTag = await tagBankCollection
                .query(Q.where("tag_name", tagName))
                .fetch();
              if (existingTag.length) {
                await termTagRelationsCollection.create((record) => {
                  record.term_id = insertedTerm.id;
                  record.tag_id = existingTag[0].id;
                });
              }
            }
          }
        });
      }
    }
  }

  console.log("Import completed");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App database={database} handleClick={handleClick} />
  </React.StrictMode>
);

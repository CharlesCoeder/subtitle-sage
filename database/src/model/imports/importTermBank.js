import database from "../../database";
import { Q } from "@nozbe/watermelondb";

const tagBankCollection = database.collections.get("tagBank");
const termTagRelationsCollection = database.collections.get("termTagRelations");
const termBankCollection = database.collections.get("termBank");

// Imports the dictionary's set of tags
async function importTags(tagArray) {
  for (const fileObj of tagArray) {
    const { filename, content } = fileObj;
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

// Imports the terms, and creates relations between each term and its associated tags
async function importTerms(termArray) {
  for (const fileObj of termArray) {
    const { filename, content } = fileObj;
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

        // If record does not yet exist, create it
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

          // Create relations between term and its tags
          const tags = entry[2];
          const tagNames = tags.split(" "); // tags are space-separated, so split them
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

// Separates the files from the ZIP into these arrays:
// tagArray = [tag_bank_1.json]
// termArray = [term_bank_1.json, term_bank_2.json, ..., term_bank_n.json]
function separateFiles(fileArray) {
  let tagArray = [];
  let termArray = [];

  for (const fileObj of fileArray) {
    const { filename } = fileObj;
    if (filename.startsWith("tag_bank_")) {
      tagArray.push(fileObj);
    } else if (filename.startsWith("term_bank_")) {
      termArray.push(fileObj);
    }
  }
  return { tagArray, termArray };
}

// Main import function for term-bank-dictionaries
export async function importTermBank(fileArray) {
  console.log("Starting import...");
  const { tagArray, termArray } = separateFiles(fileArray);
  await importTags(tagArray);
  await importTerms(termArray);
  console.log("Import finished.");
}

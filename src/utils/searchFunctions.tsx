import { Q } from "@nozbe/watermelondb";
import database from "../database/database";
import { Collection } from "@nozbe/watermelondb";
import TermBank from "../database/models/termBank";
import TermTagRelations from "../database/models/termTagRelations";
import TagBank from "../database/models/tagBank";

type TermBankInstance = InstanceType<typeof TermBank>;
const termBankCollection: Collection<TermBankInstance> =
  database.collections.get("termBank");

type TagBankInstance = InstanceType<typeof TagBank>;
const tagBankCollection: Collection<TagBankInstance> =
  database.collections.get("tagBank");

type TermTagRelationsInstance = InstanceType<typeof TermTagRelations>;
const termTagRelationsCollection: Collection<TermTagRelationsInstance> =
  database.collections.get("termTagRelations");

const searchForTerm = async (term: string) => {
  const start = performance.now();
  const matches: TermBankInstance[] = await termBankCollection
    .query(Q.where("term_text", term))
    .fetch();
  if (term) {
    console.log("\n\n-----------------------------------------");
    console.log("------ SEARCHING FOR ", term, " -------");
    console.log("-----------------------------------------");
  }

  for (const match of matches) {
    try {
      let definitions = match.definitions;
      if (Array.isArray(definitions)) {
        definitions.forEach((def) => console.log(def));
      } else {
        console.error("Definitions are not in expected format");
        console.log(typeof definitions);
      }

      const relatedTagRelations: TermTagRelationsInstance[] =
        await termTagRelationsCollection
          .query(Q.where("term_id", match.id))
          .fetch();

      const relatedTagsPromises = relatedTagRelations.map(async (relation) => {
        const tag: TagBankInstance = await tagBankCollection.find(
          relation.tag_id
        );
        return tag.tag_name;
      });

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
};

const fetchTerms = async (term: string) => {
  const start = performance.now();
  const matches: TermBankInstance[] = await termBankCollection
    .query(Q.where("term_text", term))
    .fetch();
  if (term) {
  }
  return matches;
};

const parseSentence = async (sentence: string) => {
  let parsedTerms = [];
  let index = 0;

  while (index < sentence.length) {
    let longestMatch = "";
    let longestMatchDetails: TermBankInstance[] = [];

    // Check for the longest valid term starting at the current index
    for (let length = 1; length <= sentence.length - index; length++) {
      let currentSegment = sentence.slice(index, index + length);
      let matches = await fetchTerms(currentSegment);

      if (matches.length > 0) {
        longestMatch = currentSegment;
        longestMatchDetails = matches;
      }
    }

    if (longestMatch) {
      // Add the longest match to the parsed terms
      parsedTerms.push({ term: longestMatch, details: longestMatchDetails });
      index += longestMatch.length;
    } else {
      // If no match found, add the single character as a term and move to the next character
      let singleCharacter = sentence.slice(index, index + 1);
      parsedTerms.push({ term: singleCharacter, details: [] });
      index++;
    }
  }

  return parsedTerms;
};

export { searchForTerm, parseSentence };

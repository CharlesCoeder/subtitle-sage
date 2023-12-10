import { Q } from "@nozbe/watermelondb";
import database from "../database/database";
import { Collection } from "@nozbe/watermelondb";
import TermBank from "../database/models/termBank";
import TermTagRelations from "../database/models/termTagRelations";
import TagBank from "../database/models/tagBank";
import kuromoji from "kuromoji";

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

const searchTokenizedTerms = async (sentence: string) => {
  kuromoji
    .builder({ dicPath: "/src/kuromoji-dict/" })
    .build(async (err, tokenizer) => {
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
};

export { searchForTerm, searchTokenizedTerms };

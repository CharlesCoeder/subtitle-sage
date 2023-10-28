import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
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

export default function SearchComponent() {
  const [term, setTerm] = useState("");

  const handleInputChange = (text: string) => {
    setTerm(text);
  };

  async function searchForTerm(term: string) {
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

        const relatedTagsPromises = relatedTagRelations.map(
          async (relation) => {
            const tag: TagBankInstance = await tagBankCollection.find(
              relation.tag_id
            );
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
    searchForTerm(term);
  }

  return (
    <View style={styles.container}>
      <SearchInput value={term} onChange={handleInputChange} />
      <SubmitButton onPress={handleSearch} />
    </View>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      value={props.value}
      onChangeText={props.onChange}
      placeholder="Enter search term..."
    />
  );
};

interface SubmitButtonProps {
  onPress: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Search</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    padding: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

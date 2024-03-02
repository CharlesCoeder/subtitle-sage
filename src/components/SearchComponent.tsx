import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { searchForTerm, parseSentence } from "../utils/searchFunctions";

export default function SearchComponent() {
  const [term, setTerm] = useState("");
  const [sentence, setSentence] = useState("");

  const handleTermChange = (text: string) => {
    setTerm(text);
  };

  const handleSentenceChange = (text: string) => {
    setSentence(text);
  };

  async function handleTermSearch() {
    try {
      await searchForTerm(term);
    } catch (error) {
      console.error("Error during term search:", error);
    }
  }

  async function handleSentenceSearch() {
    try {
      const parsedTerms = await parseSentence(sentence);
      const tokens = parsedTerms
        .map((parsedTerm) => parsedTerm.term)
        .join(" | ");
      console.log(`Tokens: ${tokens}`);

      for (const parsedTerm of parsedTerms) {
        await searchForTerm(parsedTerm.term);
      }
    } catch (error) {
      console.error("Error during sentence search:", error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Term Search */}
      <View style={styles.searchSection}>
        <SearchInput
          value={term}
          onChange={handleTermChange}
          placeholder="Enter term..."
        />
        <SubmitButton onPress={handleTermSearch} title="Search Term" />
      </View>

      {/* Sentence Parse and Search */}
      <View style={styles.searchSection}>
        <SearchInput
          value={sentence}
          onChange={handleSentenceChange}
          placeholder="Enter sentence..."
        />
        <SubmitButton onPress={handleSentenceSearch} title="Parse Sentence" />
      </View>
    </View>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      value={props.value}
      onChangeText={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

interface SubmitButtonProps {
  onPress: () => void;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, title }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    gap: 40,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
  button: {
    width: 120,
    height: 40,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

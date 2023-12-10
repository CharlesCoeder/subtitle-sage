import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { searchForTerm } from "../utils/searchFunctions";
import { searchTokenizedTerms } from "../utils/searchFunctions";

export default function SearchComponent() {
  const [term, setTerm] = useState("");

  const handleInputChange = (text: string) => {
    setTerm(text);
  };

  async function handleSearch() {
    searchTokenizedTerms(term);
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

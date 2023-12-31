import { Pressable, Text, View, StyleSheet } from "react-native";

interface ButtonProps {
  label: string;
  color: string;
  onPress: () => void;
}

export default function Button({ label, color, onPress }: ButtonProps) {
  const buttonStyle = [styles.button, { backgroundColor: color }];

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={buttonStyle} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

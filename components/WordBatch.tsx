// WordBatch.tsx
import { ScrollView, View } from "react-native";
import React from "react";
import { WordWithSentence } from "@/app/(tabs)";
import WordWithInfo from "./WordWithInfo";

const WordBatch = ({ batch }: { batch: WordWithSentence[] }) => {
  return (
    <ScrollView>
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
          backgroundColor: "#f9f9f9",
          gap: 10,
        }}
      >
        {batch.map((word, index) => (
          <WordWithInfo key={index} word={word.word} sentence={word.sentence} />
        ))}
      </View>
    </ScrollView>
  );
};

export default WordBatch;

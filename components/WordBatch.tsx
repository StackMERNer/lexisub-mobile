// WordBatch.tsx
import { ScrollView, View } from "react-native";
import React from "react";
import { WordWithSentence } from "@/app/(tabs)";
import WordWithInfo from "./WordWithInfo";

const WordBatch = ({ batch }: { batch: WordWithSentence[] }) => {
  return (
    <ScrollView className="p-1 gap-2 pb-40">
      {batch.map((word, index) => (
        <WordWithInfo key={index} word={word.word} sentence={word.sentence} />
      ))}
    </ScrollView>
  );
};

export default WordBatch;

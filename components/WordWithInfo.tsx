// WordWithInfo.tsx
import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";

interface Props {
  word: string;
  sentence: string;
}

const useLemmaAndMeaning = (word: string) => {
  return useQuery({
    queryKey: ["lemmaAndMeaning", word],
    queryFn: async () => {
      const lemmaRes = await fetch(
        "https://lexisub-api.onrender.com/lemmatize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word }),
        }
      );
      const lemmaData = await lemmaRes.json();
      const lemma = lemmaData.lemmas?.[0] || word;

      const meaningRes = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${lemma}`
      );
      const meaningData = await meaningRes.json();
      const meaning =
        meaningData?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
        "No definition available";

      return { lemma, meaning };
    },
    staleTime: 5 * 60 * 1000,
  });
};

const WordWithInfo = ({ word, sentence }: Props) => {
  const { data, isLoading, error } = useLemmaAndMeaning(word);

  return (
    <View
      style={{
        padding: 10,
        shadowColor: "#000",
        elevation: 2,
      }}
    >
      <Text>Word: {word}</Text>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error loading data</Text>}
      {data && (
        <>
          <Text>Lemma: {data.lemma}</Text>
          <Text>Meaning: {data.meaning}</Text>
          <Text>Sentence: {sentence}</Text>
        </>
      )}
    </View>
  );
};

export default WordWithInfo;

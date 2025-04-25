// WordWithInfo.tsx
import { View, Text, Button, TouchableOpacity } from "react-native";
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
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });
};

const WordWithInfo = ({ word, sentence }: Props) => {
  const { data, isLoading, error } = useLemmaAndMeaning(word);

  return (
    <View className="p-4 border-b border-gray-300 bg-gray-50 gap-2 shadow rounded-[20px] mb-3">
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error loading data</Text>}
      {data && (
        <>
          <Text className="text-xl font-bold">{data.lemma}</Text>
          <Text>- {data.meaning}</Text>
          <Text className="italic"> {sentence}</Text>
          <View className="flex-row justify-between mt-2 gap-2">
            <TouchableOpacity
              onPress={() => {
                // Handle the action here
              }}
              className="bg-red-400 rounded p-4 flex-1"
            >
              <Text className="font-bold text-center">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Handle the action here
              }}
              className="bg-green-500 rounded p-4 flex-1"
            >
              <Text className="text-white text-center">Add to Learning</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default WordWithInfo;

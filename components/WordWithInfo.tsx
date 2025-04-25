// WordWithInfo.tsx
import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { database } from "@/database";
import WordCard from "@/database/model/WordCard";
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

  async function addWordToLearning(
    word: string,
    sentence: string,
    meaning: string
  ) {
    console.log(word, sentence, meaning); // Check if word is set correctly here
    await database.write(async () => {
      const wordCard = await database.collections
        .get("word_cards")
        .create((card) => {
          card.word = word; // Should set the word correctly
          card.sentence = sentence;
          card.meaning = meaning;
          card.status = "learning";
          card.interval = 1;
          card.repetition = 0;
          card.efactor = 2.5;
          card.nextReview = Date.now();
        });
      console.log("wordCard", wordCard); // Check if word is set correctly here
    });
  }

  return (
    <View className="p-4 border-b border-gray-300 bg-gray-50 gap-2 shadow rounded-[20px] mb-3">
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error loading data</Text>}
      {data && (
        <>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold flex-1">{data.lemma}</Text>
            <TouchableOpacity
              onPress={() => {
                // Handle the action here
              }}
              className="bg-red-400  p-2 flex-1 rounded-full max-w-[40px] items-center justify-center"
            >
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text>- {data.meaning}</Text>
          <Text className="italic"> {sentence}</Text>
          <View className="flex-row justify-between mt-2 gap-2">
            <TouchableOpacity
              onPress={async () => {
                await addWordToLearning(data.lemma, sentence, data.meaning);
              }}
              className="bg-green-500 rounded-full p-4 flex-1"
            >
              <Text className="text-white text-center font-bold ">
                Add to Learning
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default WordWithInfo;

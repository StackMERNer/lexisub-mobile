import { database } from "@/database";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
interface Props {
  word: string;
  sentence: string;
}

const useLemmaAndMeaning = (word: string) => {
  return useQuery({
    queryKey: ["lemmaAndMeaning", word],
    queryFn: async () => {
      const meaningRes = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const meaningData = await meaningRes.json();
      const meaning =
        meaningData?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
        "No definition available";

      return { meaning };
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    gcTime: 1000 * 60 * 60 * 24 * 9, // 9 days, slight buffer
    enabled: !!word, // Only run the query if word is defined
  });
};

const WordWithInfo = ({ word, sentence }: Props) => {
  const { data, isLoading, error } = useLemmaAndMeaning(word);
  // console.log("data", data);
  async function addWordToLearning(
    word: string,
    sentence: string,
    meaning: string
  ) {
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
    });
  }

  return (
    <View className="p-4 border-b border-gray-300 bg-gray-50 gap-2 shadow rounded-[20px] mb-3">
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error loading data</Text>}
      {data && (
        <>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold flex-1">{word}</Text>
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
                await addWordToLearning(word, sentence, data.meaning);
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

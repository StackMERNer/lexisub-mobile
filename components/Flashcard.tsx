import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import WordCard from "@/database/model/WordCard";

type FlashcardProps = {
  word: WordCard;
  onAgain: () => void;
  onHard: () => void;
  onEasy: () => void;
  showAnswer: boolean;
};

const Flashcard = ({
  word,
  onAgain,
  onHard,
  onEasy,
  showAnswer,
}: FlashcardProps) => {
  return (
    <View className="rounded-2xl p-6 shadow-lg bg-white mx-4 w-11/12 items-center min-h-[60vh]">
      {!showAnswer ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold mb-8">{word.word}</Text>
          <Text className="font-bold mb-8">{word.sentence}</Text>
        </View>
      ) : (
        <>
          <View>
            <Text className="text-3xl font-bold mb-8">{word.word}</Text>
            <Text className="text-xl mb-6">{word.meaning}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default Flashcard;

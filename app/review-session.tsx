import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Flashcard from "@/components/Flashcard";
import { database } from "@/database";
import AwesomeButton from "react-native-really-awesome-button";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import WordCard from "@/database/model/WordCard";

const ReviewSession = () => {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  useEffect(() => {
    const loadDueCards = async () => {
      const allCards: WordCard[] = await database.collections
        .get<WordCard>("word_cards")
        .query()
        .fetch();
      const today = new Date().getTime();
      const due = allCards.filter((card) => card.nextReview <= today);
      setCards(due);
    };

    loadDueCards();
  }, []);

  const handleReview = async (grade: 0 | 1 | 2) => {
    if (cards[current]) {
      await cards[current].review(grade);
      setCurrent((c) => c + 1);
    }
  };

  if (current >= cards.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No more cards for today!</Text>
      </View>
    );
  }

  const card = cards[current];

  return (
    <GestureHandlerRootView className="flex-1 items-center justify-center">
      <View className="w-full h-full items-center justify-center py-4">
        <Flashcard
          word={card}
          onAgain={() => handleReview(0)}
          onHard={() => handleReview(1)}
          onEasy={() => handleReview(2)}
          showAnswer={showAnswer}
        />
        {!showAnswer ? (
          <View className="flex-1">
            <AwesomeButton
              backgroundColor="#3b82f6"
              backgroundDarker="#2563eb"
              borderRadius={15}
              raiseLevel={8}
              onPress={() => setShowAnswer(true)}
              width={200}
              style={{ marginTop: 24 }}
            >
              Show Answer
            </AwesomeButton>
          </View>
        ) : (
          <View className="flex-row justify-between w-full mt-6 px-6">
            <AwesomeButton
              backgroundColor="#fecaca" // light red
              backgroundDarker="#f87171" // darker red
              borderRadius={10}
              raiseLevel={6}
              onPress={() => handleReview(0)}
              width={100}
            >
              <Text
                style={{ color: "#ef4444", fontWeight: "bold", fontSize: 16 }}
              >
                Again
              </Text>
            </AwesomeButton>

            <AwesomeButton
              backgroundColor="#fef08a" // light yellow
              backgroundDarker="#facc15" // darker yellow
              borderRadius={10}
              raiseLevel={6}
              onPress={() => handleReview(1)}
              width={100}
            >
              <Text
                style={{ color: "#ca8a04", fontWeight: "bold", fontSize: 16 }}
              >
                Hard
              </Text>
            </AwesomeButton>

            <AwesomeButton
              backgroundColor="#bbf7d0" // light green
              backgroundDarker="#22c55e" // darker green
              borderRadius={10}
              raiseLevel={6}
              onPress={() => handleReview(2)}
              width={100}
            >
              <Text
                style={{ color: "#16a34a", fontWeight: "bold", fontSize: 16 }}
              >
                Easy
              </Text>
            </AwesomeButton>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ReviewSession;

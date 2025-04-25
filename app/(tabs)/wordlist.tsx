import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database } from "@/database";
import WordCard from "@/database/model/WordCard";
import { SafeAreaView } from "react-native-safe-area-context";

const WordList = () => {
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWordCards = useCallback(async () => {
    try {
      const cards = await database.collections
        .get("word_cards")
        .query()
        .fetch();
      const sortedCards = [...(cards as WordCard[])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setWordCards(sortedCards as WordCard[]);
    } catch (error) {
      console.log("error fetching word cards:", error);
    }
  }, []);

  useEffect(() => {
    fetchWordCards();
  }, [fetchWordCards]);

  const handleDeleteWordCard = async (wordCardId: string) => {
    Alert.alert(
      "Delete Word",
      "Are you sure you want to delete this word card?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await database.write(async () => {
                const wordCard = await database.collections
                  .get("word_cards")
                  .find(wordCardId);

                await database.collections
                  .get("deleted_words")
                  .create((card) => {
                    (card as any).word = (wordCard as any).word;
                  });

                await wordCard.destroyPermanently();
              });

              setWordCards((prevCards) =>
                prevCards.filter((card) => card.id !== wordCardId)
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWordCards();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: WordCard }) => (
    <View className="bg-white border border-gray-100 rounded-[20px] p-4 mb-4 shadow-md">
      <Text className="text-2xl font-bold capitalize">{item.word}</Text>
      <Text style={{ fontSize: 14, marginVertical: 4 }}>{item.meaning}</Text>
      <Text style={{ fontSize: 12, fontStyle: "italic" }}>{item.sentence}</Text>

      <TouchableOpacity
        onPress={() => handleDeleteWordCard(item.id)}
        className="bg-red-400 p-2 rounded-full justify-center items-center mt-2"
      >
        <Ionicons name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <FlatList
        data={wordCards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default WordList;

import { database } from "@/database";
import DeletedWord from "@/database/model/DeletedWord"; // Create this model if not already done
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DeletedWords = () => {
  const [deletedWords, setDeletedWords] = useState<DeletedWord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeletedWords = useCallback(async () => {
    try {
      const words = await database.collections
        .get("deleted_words")
        .query()
        .fetch();

      setDeletedWords(words as DeletedWord[]);
    } catch (error) {
      console.log("Error fetching deleted words:", error);
    }
  }, []);

  useEffect(() => {
    fetchDeletedWords();
  }, [fetchDeletedWords]);

  const handleRestore = async (deletedWord: DeletedWord) => {
    try {
      await database.write(async () => {
        // Just delete from deleted_words
        await deletedWord.destroyPermanently();
      });

      setDeletedWords((prev) =>
        prev.filter((word) => word.id !== deletedWord.id)
      );
    } catch (error) {
      console.log("Restore error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeletedWords();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: DeletedWord }) => (
    <View className="rounded-2xl p-4 mb-3 border-2 border-gray-100">
      <Text className="text-xl font-bold capitalize">{item.word}</Text>
      <TouchableOpacity
        onPress={() => handleRestore(item)}
        className="bg-green-500 mt-2 p-2 rounded-full items-center"
      >
        <Ionicons name="refresh" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={deletedWords}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default DeletedWords;

import { WordWithSentence } from "@/app/(tabs)";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import WordWithInfo from "./WordWithInfo";
import { database } from "@/database";

const WordBatch = ({ batch }: { batch: WordWithSentence[] }) => {
  const [filteredBatch, setFilteredBatch] = useState<WordWithSentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processBatch = async () => {
      setIsLoading(true);

      // Fetch known and removed words once
      const wordCards = await database.collections
        .get("word_cards")
        .query()
        .fetch();
      const deletedWords = await database.collections
        .get("deleted_words")
        .query()
        .fetch();

      const knownWords = new Set(
        wordCards.map((w) => (w as any).word.toLowerCase())
      );
      const removedWords = new Set(
        deletedWords.map((w) => (w as any).word.toLowerCase())
      );

      const processed: WordWithSentence[] = [];

      for (const { word, sentence } of batch) {
        const res = await fetch("https://lexisub-api.onrender.com/lemmatize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: word }),
        });
        const data = await res.json();
        const lemma = data.lemmas?.[0] || word;

        if (
          !knownWords.has(lemma.toLowerCase()) &&
          !removedWords.has(lemma.toLowerCase())
        ) {
          processed.push({ word: lemma, sentence });
        }
      }

      setFilteredBatch(processed);
      setIsLoading(false);
    };

    processBatch();
  }, [batch]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading words...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-1 gap-2 pb-40">
      {filteredBatch.map((word, index) => (
        <WordWithInfo key={index} word={word.word} sentence={word.sentence} />
      ))}
    </ScrollView>
  );
};

export default WordBatch;

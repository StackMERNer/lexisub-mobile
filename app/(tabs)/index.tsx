import { Button, Text, View } from "react-native";

import { loadStopwords } from "@/utils/loadStopwords";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import WordBatch from "@/components/WordBatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export interface WordWithSentence {
  word: string;
  sentence: string;
}
export default function HomeScreen() {
  // Create a new query client
  const queryClient = new QueryClient();
  const [wordsWithSentence, setWordsWithSentence] = useState<
    WordWithSentence[]
  >([]);
  const pickSRTFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      // console.log("content", content);
      const dialogues = parseSRT(content);

      const wordsWithContext = await extractWordsWithContext(dialogues);
      setWordsWithSentence(wordsWithContext);
      console.log("wordsWithContext", wordsWithContext.length);
    }
  };
  const parseSRT = (srtContent: string) => {
    const lines = srtContent.split("\n");
    const dialogueLines = [];
    let buffer = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (buffer.length) {
          dialogueLines.push(buffer.join(" "));
          buffer = [];
        }
      } else if (!/^\d+$/.test(line) && !/-->/i.test(line)) {
        buffer.push(line);
      }
    }

    if (buffer.length) {
      dialogueLines.push(buffer.join(" "));
    }

    return dialogueLines;
  };

  const extractWordsWithContext = async (dialogues: string[]) => {
    const stopwords = await loadStopwords();
    const wordMap = new Map<string, string>();

    const isStopword = (word: string) => stopwords.includes(word);
    console.log("stopwords", stopwords);
    dialogues.forEach((sentence) => {
      const words = sentence
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .filter((word) => !isStopword(word));

      words.forEach((word) => {
        if (!wordMap.has(word)) {
          wordMap.set(word, sentence);
        }
      });
    });

    return Array.from(wordMap, ([word, sentence]) => ({ word, sentence }));
  };
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView>
        <View>
          <Button title="Pick SRT File" onPress={pickSRTFile} />
          <WordBatch batch={wordsWithSentence.slice(0, 10)} />
        </View>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

import { Alert, Text, TouchableOpacity, View } from "react-native";

import { loadStopwords } from "@/utils/loadStopwords";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import WordBatch from "@/components/WordBatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { DatabaseProvider } from "@nozbe/watermelondb/DatabaseProvider";
import { database } from "@/database";
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
  const [totalWords, setTotalWords] = useState(0);
  const [wordsPerPage, setWordsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const pickSRTFile = async () => {
    setIsProcessing(true);
    setWordsWithSentence([]);
    setTotalWords(0);
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
      setTotalWords(wordsWithContext.length);
      setWordsWithSentence(wordsWithContext);
    } else {
      // show alert
      Alert.alert("Error", "No file selected");
    }
    setIsProcessing(false);
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
    <DatabaseProvider database={database}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView>
          <View className="h-full  justify-between p-1 bg-[#f8f2e2]">
            <TouchableOpacity
              onPress={pickSRTFile}
              className="flex-1 bg-green-100 items-center justify-center border-dashed border-2 border-green-600 rounded-[50px] "
            >
              <Text className="text-center text-lg font-bold">
                Pick SRT File
              </Text>
            </TouchableOpacity>
            {isProcessing ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-bold">Processing...</Text>
              </View>
            ) : (
              <WordBatch
                batch={wordsWithSentence.slice(
                  (currentPage - 1) * wordsPerPage,
                  currentPage * wordsPerPage
                )}
              />
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalWords / wordsPerPage)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </View>
        </SafeAreaView>
      </QueryClientProvider>
    </DatabaseProvider>
  );
}

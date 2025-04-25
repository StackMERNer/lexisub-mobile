import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View className="flex-row items-center justify-between px-1 py-2 space-x-2 gap-1">
      {/* Previous Button */}
      <TouchableOpacity
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white">Prev</Text>
      </TouchableOpacity>

      {/* Scrollable Page Numbers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1 px-2"
      >
        <View className="flex-row space-x-2 items-center">
          {pages.map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page ? "bg-blue-700" : "bg-gray-200"
              }`}
            >
              <Text
                className={`${
                  currentPage === page ? "text-white" : "text-black"
                }`}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded ${
          currentPage === totalPages ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

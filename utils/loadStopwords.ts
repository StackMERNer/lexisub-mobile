export const loadStopwords = async (): Promise<string[]> => {
  const response = await fetch(
    "https://gist.githubusercontent.com/sebleier/554280/raw/7e0e4a1ce04c2bb7bd41089c9821dbcf6d0c786c/NLTK's%2520list%2520of%2520english%2520stopwords"
  );
  const text = await response.text();
  // console.log("text", text);
  return text
    .split("\n")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
};

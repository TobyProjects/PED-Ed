import quotes from "@/assets/locales/quotes/en.json";

export function getRandomQuote(lang: "en" | "vi") {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

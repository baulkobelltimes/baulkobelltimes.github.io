import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const CORE_QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
];

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyQuote, setDailyQuote] = useLocalStorage('dailyQuote', null);

  // Load quotes from JSON
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch('/quotes.json');
        if (response.ok) {
          const data = await response.json();
          const formattedQuotes = data
            .filter(q => q.quote && q.author)
            .map(q => ({ text: q.quote, author: q.author }));
          setQuotes(formattedQuotes.length > 0 ? formattedQuotes : CORE_QUOTES);
        } else {
          setQuotes(CORE_QUOTES);
        }
      } catch {
        setQuotes(CORE_QUOTES);
      }
    };

    loadQuotes();
  }, []);

  // Get daily quote or cached quote
  useEffect(() => {
    if (quotes.length === 0) return;

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (dailyQuote?.timestamp && (now - dailyQuote.timestamp) < twentyFourHours) {
      setCurrentQuote(dailyQuote.quote);
      setIsLoading(false);
    } else {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(newQuote);
      setDailyQuote({ quote: newQuote, timestamp: now });
      setIsLoading(false);
    }
  }, [quotes, dailyQuote, setDailyQuote]);

  const refreshQuote = useCallback(() => {
    if (quotes.length === 0) return;
    
    setIsLoading(true);
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
    setDailyQuote({ quote: newQuote, timestamp: Date.now() });
    setIsLoading(false);
  }, [quotes, setDailyQuote]);

  return {
    quote: currentQuote,
    isLoading,
    refreshQuote
  };
};

export default useQuotes;

import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const CORE_QUOTES = [
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' }
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [dailyQuote, setDailyQuote] = useLocalStorage('dailyQuote', null);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch('/quotes.json');
        if (response.ok) {
          const data = await response.json();
          const formattedQuotes = data
            .filter((q) => q.quote && q.author)
            .map((q) => ({ text: q.quote, author: q.author }));
          setQuotes(formattedQuotes.length > 0 ? formattedQuotes : CORE_QUOTES);
          return;
        }
      } catch {
        // Fall through to defaults.
      }

      setQuotes(CORE_QUOTES);
    };

    loadQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    const now = Date.now();
    const isExistingQuoteValid = dailyQuote?.timestamp
      && (now - dailyQuote.timestamp) < ONE_DAY_MS
      && dailyQuote.quote;

    if (isExistingQuoteValid) return;

    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote({ quote: newQuote, timestamp: now });
  }, [quotes, dailyQuote, setDailyQuote]);

  const refreshQuote = useCallback(() => {
    if (quotes.length === 0) return;

    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote({ quote: newQuote, timestamp: Date.now() });
  }, [quotes, setDailyQuote]);

  return {
    quote: dailyQuote?.quote ?? null,
    isLoading: quotes.length === 0,
    refreshQuote
  };
};

export default useQuotes;

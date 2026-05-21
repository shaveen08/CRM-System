import React, { useEffect, useState } from "react";

const useDebounce = (inputText, delay) => {
  const [debounceText, setDebounceText] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceText(inputText);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [inputText]);

  return debounceText;
};

export default useDebounce;

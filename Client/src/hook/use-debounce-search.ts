import { useState, useEffect } from 'react'

const useDebounce = (delay: number) => {
   const [search, setSearch] = useState("");
   const [debounceSearch, setDebounceSearch] = useState("");
   useEffect(() => {
      const timer = setTimeout(() => {
         setDebounceSearch(search);
      }, delay);
      return () => clearTimeout(timer);
   }, [search, delay]);
   return ({ search, setSearch, debounceSearch });
}
export default useDebounce

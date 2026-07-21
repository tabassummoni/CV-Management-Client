// import React, { createContext, useState, useEffect, useContext } from 'react';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
//   const [t, setT] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTranslations = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:5001/api/locales/${lang}`);
//         if (res.ok) {
//           const data = await res.json();
//           setT(data);
//         } else {
//           console.error(`Backend returned status: ${res.status}`);
//         }
//       } catch (err) {
//         console.error("Error loading global language:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTranslations();
//   }, [lang]);

//   const changeLanguage = (newLang) => {
//     setLang(newLang);
//     localStorage.setItem('lang', newLang);
//   };

//   return (
//     <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
//       {loading && Object.keys(t).length === 0 ? (
//         <div className="flex items-center justify-center h-screen bg-base-100 text-purple-600 font-semibold">
//           Loading Language Module...
//         </div>
//       ) : (
//         children
//       )}
//     </LanguageContext.Provider>
//   );
// };

// export const useLang = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error("useLang must be used within a LanguageProvider");
//   }
//   return context;
// };
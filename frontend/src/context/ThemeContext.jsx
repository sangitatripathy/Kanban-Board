import React,{ createContext,useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
  const [theme,setTheme] = useState("light")

  useEffect(()=>{
    const savedTheme=localStorage.getItem("theme")
    if(savedTheme) setTheme(savedTheme)
  },[])

  useEffect(()=>{
    const root= document.documentElement

    if(theme === "dark"){
      root.classList.add("dark")
    } else{
      root.classList.remove("dark")
    }

    localStorage.setItem("theme",theme)
  },[theme])

  const toggleTheme = () =>{
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return(
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

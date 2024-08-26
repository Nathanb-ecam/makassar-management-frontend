import React , { CSSProperties, useContext, useEffect, useState } from "react";
import TopMessagePopup from "../components/main/TopMessagePopup";

const TopMessageContext = React.createContext({});


export const TopMessageProvider = ({ children }) => {
  
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<CSSProperties>();

  const showTopMessage = (msg: string, customCSS:{}, duration = 3000) =>{
    setMessage(msg)
    setStyle(customCSS)
    setVisible(true)
    setTimeout(()=>{
      setVisible(false)
    },duration)
  }
  
  
  return (
    <TopMessageContext.Provider value={{ showTopMessage }}>
      {children}
      {visible &&
        <TopMessagePopup customCSS={style}>
            <div>{message}</div>
        </TopMessagePopup>
      }
    </TopMessageContext.Provider>
  );
};


export const useTopMessage = () => {
  const context = useContext(TopMessageContext);

  if (context==null){
    throw new Error("useTopMessage most be used inside of an TopMessageProvider")
  }

  return context 
}
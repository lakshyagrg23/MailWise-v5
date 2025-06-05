/* eslint-disable no-unused-vars */
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { createContext } from 'react'
import GmailOAuthApp from './GmailOAuthApp';
import fetchEmails from './api/api';
import Error from './components/error/Error';
import SuspenseLoader from './components/error/SuspenseLoader';

import { lazy } from "react"
const Main=lazy(()=>import('./pages/Main'));
const Email=lazy(()=>import('./components/Email'));
const ViewEmails=lazy(()=>import('./components/ViewEmails'))

export const emailContext=createContext();

const App = () => {
  const [emails, setEmails] = useState([]);
  const [messageSent,setmessageSent]=useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded,setLoaded]=useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [category,setCategory]=useState("All") // Default category
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedEmails,setSelectedEmails]=useState([]);
  const [name, setName] = useState("");
  const [email,setEmail]=useState("");
  const [picture,setPicture]=useState("");
  const [categories, setCategories] = useState([{ name: "All", title: "All Emails" }]);
  const [data, setData] = useState({});
  const [openAi,setOpenAi]=useState(false);
  const [date,setDate]=useState(new Date());
  const [newMailsLoaded,setNewMailsLoaded]=useState(false);
  const [mailsReceived,setMailsReceived]=useState(false);
  const [message,setMessage]=useState("");
  const [update,setUpdate]=useState(1);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    const userId = urlParams.get("user_id");
    const userName = urlParams.get("name");
    console.log(userId)
  
    if (token && userId && userName) {
      setAuthenticated(true);
      setAccessToken(token);
      setSelectedUser(userId);  // Store user ID in state
      setName(decodeURIComponent(userName));  // Store user name
    }
  }, []);

  useEffect(() => {
    if (emails.length===0 && authenticated && accessToken) {
      fetchEmailData(category);
    }
    // else console.log("not found")
  }, [authenticated, category, accessToken]);

const fetchEmailData = async (category) => {
  if (!selectedUser) return;  // Ensure userId is available
  const {emails,email,pic} = await fetchEmails(category, accessToken, selectedUser,date);
  setEmails(emails);
  setEmail(email)
  setPicture(pic);
  setLoaded(true);
};

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Navigate to={`/email`} />} />
        <Route path="/" element={<Main />}>
          <Route path={`emails/:type`} element={<Email/>} Error={<Error />} />
          <Route path={'/view'} element={<ViewEmails/>} Error={<Error />} />
        </Route>
        <Route path={"/*"} element={<Navigate to={`emails/inbox`} />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <emailContext.Provider value={{
    emails, setEmails, category, setCategory, loaded, setLoaded, 
    selectedUser, setSelectedUser, name, setName, 
    selectedEmails, setSelectedEmails, accessToken,
    categories, setCategories ,messageSent,setmessageSent,
    data,setData,openAi,setOpenAi,email,setEmail,picture,
    setPicture,date,setDate,newMailsLoaded,setNewMailsLoaded,
    mailsReceived,setMailsReceived,message,setMessage,
    update,setUpdate
}}>


        {!authenticated ? (
          <GmailOAuthApp setAuthenticated={setAuthenticated} />
        ) : (
          <RouterProvider router={router} />
        )}
      </emailContext.Provider>
    </Suspense>
  );
};

export default App;

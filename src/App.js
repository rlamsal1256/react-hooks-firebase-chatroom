import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDDQ0-5qa9EiFw2F1uMfG-nVwSz9VSXZNA",
  authDomain: "react-firebase-chatroom-f02a1.firebaseapp.com",
  databaseURL: "https://react-firebase-chatroom-f02a1.firebaseio.com",
  projectId: "react-firebase-chatroom-f02a1",
  storageBucket: "react-firebase-chatroom-f02a1.appspot.com",
  messagingSenderId: "549870285878"
};
const fire = firebase.initializeApp(config);
const db = fire.database();

const App = () => {
  const [nickname, setNickName] = useState('');
  const [joined, setJoined] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState({});

  const chatRoom = db.ref().child('chatrooms').child('global');

  useEffect(() => {
    const handleNewMessages = snap => {
      if (snap.val()) setMessages(snap.val());
    };
    chatRoom.on('value', handleNewMessages);
    return () => {
      chatRoom.off('value', handleNewMessages);
    };
  });

  const handleNameChange = e => setNickName(e.target.value);

  const handleClick = e => {
    db.ref().child('nicknames').push({
      nickname
    });
    setJoined(true);
  };

  const handleMsgChange = e => setMsg(e.target.value);

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      chatRoom.push({
        sender: nickname,
        msg,
      });
      setMsg("");
    }
  };

  return (
      <div className="App">
        {!joined ? (
          <div className="joinForm">
            <input className="form-control" placeholder="Nickname" value={nickname} onChange={handleNameChange} /><br />
            <button className="btn btn-primary" onClick={handleClick}>Join</button>
          </div>
        ) : (
          <div className="chat">
            <div className="messages">
              {Object.keys(messages).map(message => {
                if (messages[message]["sender"] === nickname)
                  return (
                    <div className="message">
                      <span id="me">{messages[message]["sender"]} :</span><br />
                      {messages[message]["msg"]}
                    </div>
                  );
                else
                  return (
                    <div className="message">
                      <span id="sender">{messages[message]["sender"]} :</span><br />
                      {messages[message]["msg"]}
                    </div>
                  );
              })}
            </div>
            <input className="form-control" placeholder="msg" onChange={handleMsgChange} onKeyDown={handleKeyDown} value={msg} /><br />
          </div>
        )}
      </div>
  );
};

export default App;
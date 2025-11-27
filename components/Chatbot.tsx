'use client';

import { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ author: 'user' | 'bot'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (action: 'translate' | 'summarize') => {
    if (inputText.trim() === '') return;

    const userMessage = { author: 'user' as 'user', text: inputText };
    let botMessageText = '';

    if (action === 'translate') {
      botMessageText = `[Mock Translation]: "${inputText}" has been translated.`;
    } else {
      botMessageText = `[Mock Summary]: Here is a summary of "${inputText}".`;
    }
    
    const botMessage = { author: 'bot' as 'bot', text: botMessageText };

    setMessages([...messages, userMessage, botMessage]);
    setInputText('');
  };

  const styles = {
    fab: {
      position: 'fixed' as 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    chatWindow: {
      position: 'fixed' as 'fixed',
      bottom: '90px',
      right: '20px',
      width: '350px',
      height: '500px',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column' as 'column',
    },
    chatHeader: {
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
    },
    chatBody: {
      flexGrow: 1,
      overflowY: 'auto' as 'auto',
    },
    botMessage: {
      backgroundColor: '#f1f1f1',
      borderRadius: '10px',
      maxWidth: '80%',
    },
    userMessage: {
      backgroundColor: '#d1e7fd',
      borderRadius: '10px',
      maxWidth: '80%',
    }
  };

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center justify-content-center" style={styles.fab} onClick={toggleChat}>
        {/* You can use an icon here */}
        Chat
      </button>

      <div className="card" style={styles.chatWindow}>
        <div className="card-header text-white bg-dark text-center" style={styles.chatHeader}>
          AI Assistant
        </div>
        <div className="card-body" style={styles.chatBody}>
          {messages.map((msg, index) => (
            <div key={index} className={`d-flex mb-3 ${msg.author === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className="p-2" style={msg.author === 'user' ? styles.userMessage : styles.botMessage}>
                {msg.text}
              </div>
            </div>
          ))}
           <div className="p-2 text-muted text-center" style={{display: messages.length === 0 ? 'block' : 'none'}}>
            Ask me to translate or summarize text!
          </div>
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('summarize')}
            />
          </div>
          <div className="d-flex justify-content-around mt-2">
             <button className="btn btn-outline-primary btn-sm" onClick={() => handleSendMessage('translate')}>Translate</button>
             <button className="btn btn-outline-primary btn-sm" onClick={() => handleSendMessage('summarize')}>Summarize</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;

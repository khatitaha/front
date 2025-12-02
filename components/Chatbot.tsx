'use client';

import { useState } from 'react';

const BASE_URL = 'http://localhost:8086';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ author: 'user' | 'bot'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (action: 'translate' | 'summarize') => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { author: 'user' as 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/ai/${action}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the bot.');
      }

      const data = await response.json();
      const botMessageText = data.summary || data.translated_text || 'Sorry, I could not process that.';
      const botMessage = { author: 'bot' as 'bot', text: botMessageText };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = { author: 'bot' as 'bot', text: 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading && <div className="p-2 text-muted text-center">Thinking...</div>}
           <div className="p-2 text-muted text-center" style={{display: messages.length === 0 && !isLoading ? 'block' : 'none'}}>
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
              disabled={isLoading}
            />
          </div>
          <div className="d-flex justify-content-around mt-2">
             <button className="btn btn-outline-primary btn-sm" onClick={() => handleSendMessage('translate')} disabled={isLoading}>Translate</button>
             <button className="btn btn-outline-primary btn-sm" onClick={() => handleSendMessage('summarize')} disabled={isLoading}>Summarize</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;

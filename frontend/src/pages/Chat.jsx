import { useState } from 'react';
import { chatWithBot } from '../services/api';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your Pharma Assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await chatWithBot(userMsg.text);
            setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>AI Assistant</h2>
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role === 'user' ? 'message-user' : 'message-bot'}`}>
                        {msg.role === 'bot' ? (
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.5rem' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ margin: 0, paddingLeft: '1.5rem' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ margin: '0.25rem 0' }} {...props} />
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
                {loading && <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Typing...</div>}
            </div>

            <form onSubmit={handleSend} className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about inventory, medicines..."
                    className="form-input"
                    style={{ flex: 1 }}
                />
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: 'auto' }}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;

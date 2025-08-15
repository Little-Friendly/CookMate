import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../client';
import axiosInstance from '../axios-instance';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setLoading(true);
        
        // Add user message to chat
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            // Send message to backend chat endpoint
            const response = await axiosInstance.post('/chat', {
                message: inputMessage
            });
            
            const botMessage = {
                id: Date.now() + 1,
                text: response.data.response || "I'm your cooking assistant! I can help you with recipe suggestions, cooking tips, and meal planning. What would you like to know?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback response if backend is not available
            const botMessage = {
                id: Date.now() + 1,
                text: "I'm your cooking assistant! I can help you with recipe suggestions, cooking tips, and meal planning. What would you like to know?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-green-600">CookMate</h1>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => navigate('/recipes')}
                                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Recipes
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
                        <h2 className="text-xl font-semibold">Cooking Assistant</h2>
                        <p className="text-green-100 text-sm">Ask me anything about cooking!</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>Start a conversation with your cooking assistant!</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.sender === 'user'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        <p>{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                                        }`}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                                    <p>Typing...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4">
                        <form onSubmit={handleSendMessage} className="flex space-x-4">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask about recipes, cooking tips, or meal planning..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !inputMessage.trim()}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

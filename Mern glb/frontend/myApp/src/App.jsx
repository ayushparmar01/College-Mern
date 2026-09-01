import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    const response = await fetch('http://localhost:5000/api/hello');
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>MERN Loop Test</h1>
      <button onClick={fetchMessage}>
        Get message from backend
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
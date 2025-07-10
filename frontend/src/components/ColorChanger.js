import React, { useState, useEffect } from 'react';

const ColorChanger = () => {
  const [colors, setColors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch colors from the FastAPI backend on component mount
  useEffect(() => {
    const fetchColors = async () => {
      try {
        // Assuming your FastAPI backend runs on http://localhost:8000
        const response = await fetch('http://localhost:8000/colors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setColors(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle background color change
  const handleChangeColor = () => {
    if (colors.length === 0) return;

    const nextIndex = (currentIndex + 1) % colors.length;
    const nextColor = colors[nextIndex];
    setCurrentIndex(nextIndex);

    // Apply the new color to the document body's background style
    document.body.style.backgroundColor = nextColor;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading colors...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Ensure it takes full viewport height
      transition: 'background-color 0.5s ease-in-out'
    }}>
      <h1>Background Color Changer</h1>
      <button
        onClick={handleChangeColor}
        disabled={colors.length === 0} // Disable button if no colors are loaded
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          cursor: 'pointer',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease'
        }}
      >
        Change Background Color
      </button>
      {colors.length === 0 && !loading && !error && (
        <p style={{ marginTop: '10px' }}>No colors fetched. Ensure backend is running.</p>
      )}
    </div>
  );
};

export default ColorChanger;

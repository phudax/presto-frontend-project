import React, { useState } from 'react';

function DarkMode () {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    if (!isNightMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme', 'light');
    }
  };

  return (
     <button onClick={toggleNightMode} className="text-center btn bg-success text-light fw-bold my-3 mx-3">
      {isNightMode ? 'Turn Off Night Mode' : 'Turn On Night Mode'}
    </button>
  );
}

export default DarkMode;

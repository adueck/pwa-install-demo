import React, { useEffect, useState } from 'react';
import './App.css';

const repo = "https://github.com/adueck/pwa-install-demo";
let deferredPrompt;  
    
function App() {
  const [installable, setInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('INSTALL: Success');
    });
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }
  }, []);

  const handleInstallClick = (e) => {
      // Hide the app provided install promotion
      setInstallable(false);
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h2>Install Demo</h2>
        {installable &&
          <button className="install-button" onClick={handleInstallClick}>
            INSTALL ME
          </button>
        }
        {(!installable && !installed) &&
          <p>Sorry, your browser doesn't support the internal install button</p>
        }
        <p>
          <a href={repo} className="App-link">View source on GitHub</a>
        </p>
      </header>
    </div>
  );
}

export default App;

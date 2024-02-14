import React, {useState} from 'react'
import './styles.css'
const ShareButton = () => {
    const [copied, setCopied] = useState(false);
    const handleClick = () => {
        const url = window.location.href; // Get the current URL
        navigator.clipboard.writeText(url) // Copy the URL to the clipboard
          .then(() => {
            console.log('URL copied to clipboard');
            setCopied(true); // Show the "Copied" message
    
            // Hide the "Copied" message after 2 seconds
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy URL: ', err);
          });
      };
  return (
    <>
    <button className="share-button" onClick={handleClick}>
        Share Now
      </button>
      {copied && <div className="copied-message">Copied! Send this link to your work bestie</div>}
      </>
  )
}

export default ShareButton
import { useState } from "react";
import EmojiCanvas from "./components/EmojiCanvas";

const App = () => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const emojis = ["😀", "😎", "😍", "👾", "🐱", "🌟", "🚀", "⚽"];

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji); // Set the selected emoji
  };

  return (
    <div>
      {!selectedEmoji ? (
        <div>
          <h1>Choose Your Emoji to Enter the World</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {emojis.map((emoji, index) => (
              <div
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                style={{
                  cursor: "pointer",
                  fontSize: "40px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  transition: "0.3s",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmojiCanvas selectedEmoji={selectedEmoji} />
      )}
    </div>
  );
};

export default App;

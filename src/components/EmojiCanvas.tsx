import { FC, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

interface EmojiCanvasProps {
  selectedEmoji: string;
}

type OtherPlayerType = {
  emoji: string;
  x: number;
  y: number;
};

const EmojiCanvas: FC<EmojiCanvasProps> = ({ selectedEmoji }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState({
    x: 100,
    y: 100,
    emoji: selectedEmoji,
  });
  const [otherPlayers, setOtherPlayers] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // Get the 2D drawing context
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // Set canvas display size (CSS pixels)
    const canvasWidth = 600;
    const canvasHeight = 600;

    // Set canvas internal size to the device pixel ratio size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Apply CSS size to maintain correct appearance
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Function to draw emoji
    const drawEmoji = (emoji: string, x: number, y: number) => {
      ctx.font = "40px Arial";
      ctx.fillText(emoji, x, y);
    };

    // Function to clear and redraw the canvas
    const drawCanvas = () => {
      // Clear the entire canvas before redrawing
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw the player's emoji
      drawEmoji(player.emoji, player.x, player.y);

      // Draw other players' emojis
      otherPlayers.forEach((otherPlayer: OtherPlayerType) => {
        drawEmoji(otherPlayer.emoji, otherPlayer.x, otherPlayer.y);
      });
    };

    // Draw the canvas initially
    drawCanvas();

    // Optional: return a cleanup function if necessary
    return () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    };
  }, [player, otherPlayers]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      let newX = player.x;
      let newY = player.y;

      if (key === "ArrowUp") newY -= 10;
      if (key === "ArrowDown") newY += 10;
      if (key === "ArrowLeft") newX -= 10;
      if (key === "ArrowRight") newX += 10;

      if (newX >= 0 && newX <= 560 && newY >= 40 && newY <= 600) {
        const updatedPlayer = { ...player, x: newX, y: newY };
        setPlayer(updatedPlayer);
        socket.emit("playerMoved", updatedPlayer);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [player]);

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setOtherPlayers(players);
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ border: "1px solid black" }}
    />
  );
};

export default EmojiCanvas;

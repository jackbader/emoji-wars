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

    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (!ctx) {
      return;
    }

    const drawEmoji = (emoji: string, x: number, y: number) => {
      ctx.font = "40px Arial";
      ctx.fillText(emoji, x, y);
    };

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawEmoji(player.emoji, player.x, player.y);
      otherPlayers.forEach((otherPlayer: OtherPlayerType) => {
        drawEmoji(otherPlayer.emoji, otherPlayer.x, otherPlayer.y);
      });
    };

    drawCanvas();
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

      if (newX >= 0 && newX <= 960 && newY >= 0 && newY <= 960) {
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
      width={1000}
      height={1000}
      style={{ border: "1px solid black" }}
    />
  );
};

export default EmojiCanvas;

import React from "react";
import ReactDOM from "react-dom/client";
import "./app.css"
import timelineItems from "./timelineItems.js";
import { ThemeProvider } from "./components/ThemeProvider.js";
import Background3D from "./components/Background3D.js";
import ThemeToggle from "./components/ThemeToggle.js";
import Timeline from "./components/timeline/Timeline.js";

function App() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <main className="flex min-h-screen flex-col items-center p-8 relative overflow-hidden">
        <Background3D />
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="z-10 w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Timeline Visualization
          </h1>
          <p className="text-base mb-8 text-center text-gray-300">
            See your activities for today! 🤩
          </p>
          <div className="w-full bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
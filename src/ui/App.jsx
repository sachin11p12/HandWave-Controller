import React, { useRef, useEffect, useState } from "react";
import { GestureTracker } from "../vision/gestureTracker";
import { controller } from "../logic/controller";
import Settings from "./Settings";

export default function App() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [gesture, setGesture] = useState("NONE");
  const [videoSrc, setVideoSrc] = useState(
    "https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-slow-ly-moving-over-the-mountains-42614-large.mp4"
  );
  const fileInputRef = useRef(null);
  const [debugData, setDebugData] = useState(null);
  const [lastAction, setLastAction] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const tracker = new GestureTracker(videoRef.current, (gestureData) => {
      if (gestureData.error) {
        setStatus("Error: " + gestureData.error);
        return;
      }

      controller.handleGestureData(gestureData);
      if (gestureData.detected) {
        setGesture(gestureData.gesture);
        setDebugData(gestureData);
        setStatus("Tracking");
        if (gestureData.gesture !== "NONE") {
          setLastAction(gestureData.gesture);
          setTimeout(() => setLastAction(""), 2000);
        }
      } else {
        setGesture("NONE");
        setStatus("No Hand Detected");
      }
    });

    tracker.start();

    return () => tracker.stop();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col items-center">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">GestureMotion AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
              status === "Tracking"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                status === "Tracking" ? "bg-emerald-400" : "bg-red-400"
              }`}
            ></div>
            {status}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24 flex flex-col items-center gap-12 max-w-6xl relative">
        {/* Hero Section */}
        <div className="w-full grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Settings & Preview */}
          <div className="space-y-8 flex flex-col items-center lg:items-start shrink-0">
            <Settings />

            {/* Webcam Preview Card */}
            <div className="w-full max-w-md bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden relative shadow-xl">
              <video
                ref={videoRef}
                className="w-full scale-x-[-1] transition-all duration-700 aspect-video bg-black"
                muted
                playsInline
                autoPlay
              />
              <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                <div className="flex justify-between items-center">
                  <span className="bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white/70">
                    W: 640 H: 480
                  </span>
                  {gesture !== "NONE" && (
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white animate-bounce">
                      {gesture}
                    </span>
                  )}
                </div>

                {/* Finger Debug Indicator */}
                <div className="flex gap-1 justify-center bg-black/40 p-1.5 rounded-lg backdrop-blur-sm mt-1">
                  {["thumb", "index", "middle", "ring", "pinky"].map(
                    (finger) => {
                      const isOpen = debugData?.fingerStates?.[finger];
                      const isTracking = !!debugData?.detected;
                      return (
                        <div
                          key={finger}
                          className="flex flex-col items-center px-1"
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isTracking && isOpen
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                : "bg-slate-700"
                            }`}
                          ></div>
                          <span className="text-[7px] uppercase text-white/50 font-bold mt-0.5">
                            {finger[0]}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Error Recovery Button */}
                {status.includes("Error") && (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full mt-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/30 transition-all pointer-events-auto"
                  >
                    🔄 Restart Camera
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Demo Content & Video */}
          <div className="space-y-12 w-full">
            <section className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Air-Gesture <br />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  Video Control
                </span>
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                  Control your playback without touching the screen. Use
                  standard hand gestures to play, pause, seek, and change speed.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <span>📂</span> Load Local Video
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                </div>
              </div>
            </section>

            {/* Demo Video Frame */}
            <div className="aspect-video w-full rounded-2xl bg-black shadow-2xl overflow-hidden border border-white/5 group relative ring-1 ring-white/10">
              <video
                id="content-video"
                className="w-full h-full object-contain"
                controls
                loop
                key={videoSrc}
                src={videoSrc}
              />

              {/* Action Notification Overlay */}
              {lastAction && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px] transition-all animate-in fade-in zoom-in duration-300">
                  <div className="bg-blue-600/90 text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl shadow-blue-500/40 tracking-tighter uppercase flex items-center gap-4 border border-white/20">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    {lastAction.replace("_", " ")}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions Card */}
            <div className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
              <h3 className="text-xl font-bold text-blue-400">How to use</h3>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>
                  •{" "}
                  <span className="text-slate-100 font-semibold">✋ Palm</span>:
                  Show your full palm to play.
                </li>
                <li>
                  •{" "}
                  <span className="text-slate-100 font-semibold">✊ Fist</span>:
                  Close your hand to pause.
                </li>
                <li>
                  •{" "}
                  <span className="text-slate-100 font-semibold">👉 Swipe</span>
                  : Point one finger and move it fast to skip.
                </li>
                <li>
                  •{" "}
                  <span className="text-slate-100 font-semibold">
                    ✌ Two Fingers
                  </span>
                  : Show two fingers to toggle 2x speed.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        Built with MediaPipe Hands & React &bull; 100% Local Gesture Processing
      </footer>
    </div>
  );
}

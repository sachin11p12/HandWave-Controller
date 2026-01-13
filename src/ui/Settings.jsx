import React, { useState, useEffect } from "react";
import { controller } from "../logic/controller";

export default function Settings() {
  const [settings, setSettings] = useState(controller.settings);

  useEffect(() => {
    controller.updateSettings(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseInt(value),
    }));
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md text-slate-100 space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        Gesture Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between group">
          <div>
            <p className="font-semibold">Enable Hand Gestures</p>
            <p className="text-xs text-slate-400">
              Control video with your hand
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enabled"
              checked={settings.enabled}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end">
            <p className="font-semibold text-sm">Action Cooldown</p>
            <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-blue-400">
              {settings.cooldownMs}ms
            </span>
          </div>
          <input
            type="range"
            name="cooldownMs"
            min="200"
            max="2000"
            step="100"
            value={settings.cooldownMs}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Gesture Legend
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">✋</span> Open Palm: Play
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">✊</span> Fist: Pause
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">👉</span> Swipe R: +10s
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">👈</span> Swipe L: -10s
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">✌</span> 2 Fingers: 2x
            Speed
          </div>
        </div>
      </div>
    </div>
  );
}

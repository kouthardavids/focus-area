import React, { useState, useEffect, useRef } from "react";
import { Pause, Play, BookOpen, Smartphone, AlertTriangle } from "lucide-react";

import { BACKGROUNDS } from "../data/imageurls";
import { useGoogleFonts } from "../api/googlefontapi";
import { useYouTubeMusicPlayer } from "../components/YoutubeMusicPlayer";
import { Glass, MusicButton, SettingsButton } from "../components/Panels";

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export default function ActiveStudySession() {
    useGoogleFonts();

    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [secondsLeft, setSecondsLeft] = useState(42 * 60 + 37);
    const [isPaused, setIsPaused] = useState(false);
    const [ended, setEnded] = useState(false);

    const [musicPanelOpen, setMusicPanelOpen] = useState(false);
    const player = useYouTubeMusicPlayer(googleApiKey);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [phoneDetected, setPhoneDetected] = useState(false);

    const musicPanelRef = useRef<HTMLDivElement>(null);
    const settingsPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPaused || ended || secondsLeft <= 0) return;
        const id = setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);
        return () => clearInterval(id);
    }, [isPaused, ended, secondsLeft]);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (
                musicPanelOpen &&
                musicPanelRef.current &&
                !musicPanelRef.current.contains(e.target as Node)
            ) {
                setMusicPanelOpen(false);
            }
            if (
                settingsOpen &&
                settingsPanelRef.current &&
                !settingsPanelRef.current.contains(e.target as Node)
            ) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [musicPanelOpen, settingsOpen]);

    const closeMusicPanel = () => {
        player.stopMusic();
        setMusicPanelOpen(false);
    };

    const serif = { fontFamily: "'Fraunces', serif" };
    const sans = { fontFamily: "'Inter', sans-serif" };

    if (ended) {
        return (
            <div
                className="relative w-full h-screen min-h-screen overflow-hidden flex items-center justify-center"
                style={{
                    backgroundImage: `url(${background.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/60" />
                <Glass className="relative z-10 rounded-[28px] px-10 py-9 flex flex-col items-center gap-5 max-w-sm mx-4 text-center">
                    <p
                        className="text-[#F3ECE0] text-2xl"
                        style={{ ...serif, fontWeight: 400 }}
                    >
                        Session complete
                    </p>
                    <p className="text-[#C9BFAF] text-sm" style={sans}>
                        You studied Python Tuples for {formatTime(42 * 60 + 37 - secondsLeft)}.
                    </p>
                    <button
                        onClick={() => {
                            setEnded(false);
                            setSecondsLeft(42 * 60 + 37);
                            setIsPaused(false);
                        }}
                        style={sans}
                        className="mt-2 px-6 py-2.5 rounded-full bg-[#E7A967]/90 hover:bg-[#E7A967] text-[#1a140a] text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECE0]"
                    >
                        Start another session
                    </button>
                </Glass>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-screen min-h-screen overflow-hidden select-none"
            style={{
                backgroundImage: `url(${background.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div
                ref={player.playerContainerRef}
                className="fixed -left-[9999px] top-0 w-[160px] h-[90px]"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(6,8,13,0.62) 0%, rgba(6,8,13,0.30) 32%, rgba(6,8,13,0.32) 68%, rgba(6,8,13,0.66) 100%)",
                }}
            />

            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6">
                <span
                    className="text-[#F3ECE0]/90 text-[15px] tracking-wide"
                    style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 500 }}
                >
                    Study Room
                </span>

                <div className="flex items-center gap-2">
                    <MusicButton
                        ref={musicPanelRef}
                        player={player}
                        apiKey={googleApiKey}
                        open={musicPanelOpen}
                        onToggleOpen={() => setMusicPanelOpen((v) => !v)}
                        onClose={closeMusicPanel}
                    />

                    <SettingsButton
                        ref={settingsPanelRef}
                        backgrounds={BACKGROUNDS}
                        selectedId={background.id}
                        onSelect={setBackground}
                        open={settingsOpen}
                        onToggleOpen={() => setSettingsOpen((v) => !v)}
                    />
                </div>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
                {/* Timer with breathing glow */}
                <div className="relative flex items-center justify-center mb-9">
                    <div
                        className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full motion-reduce:animate-none"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(231,169,103,0.28) 0%, rgba(231,169,103,0.08) 45%, rgba(231,169,103,0) 70%)",
                            animation: isPaused ? "none" : "breathe 4.5s ease-in-out infinite",
                        }}
                    />
                    <span
                        className="relative text-[#F8F1E6] text-[76px] sm:text-[104px] leading-none tabular-nums"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: 400,
                            textShadow: "0 0 40px rgba(231,169,103,0.35)",
                        }}
                    >
                        {formatTime(secondsLeft)}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => setIsPaused((v) => !v)}
                        style={sans}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.16] backdrop-blur-xl transition-colors text-[14px] text-[#F3ECE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECE0]/70"
                    >
                        {isPaused ? (
                            <>
                                <Play className="w-[15px] h-[15px]" strokeWidth={2} fill="currentColor" />
                                Resume
                            </>
                        ) : (
                            <>
                                <Pause className="w-[15px] h-[15px]" strokeWidth={2} fill="currentColor" />
                                Pause
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setEnded(true)}
                        style={sans}
                        className="text-[13px] text-[#C9BFAF]/80 hover:text-[#F3ECE0] transition-colors underline decoration-white/20 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3ECE0]/70 rounded"
                    >
                        End Session
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex justify-center px-4">
                <Glass className="rounded-full px-2 py-2 flex items-center flex-wrap justify-center gap-x-1 gap-y-1.5">
                    <div className="flex items-center gap-1.5 px-3 py-1" style={sans}>
                        <BookOpen className="w-[13px] h-[13px] text-[#F3ECE0]/70" strokeWidth={2} />
                        <span className="text-[12px] text-[#F3ECE0]/80">Python Tuples</span>
                    </div>

                    <span className="w-px h-3.5 bg-white/15" />

                    <button
                        onClick={() => setPhoneDetected((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors hover:bg-white/[0.06]"
                        style={sans}
                        title="Demo: click to toggle phone detection"
                    >
                        {phoneDetected ? (
                            <>
                                <AlertTriangle className="w-[13px] h-[13px] text-[#D97B62]" strokeWidth={2} />
                                <span className="text-[12px] text-[#D97B62]">Phone detected</span>
                            </>
                        ) : (
                            <>
                                <Smartphone className="w-[13px] h-[13px] text-[#F3ECE0]/60" strokeWidth={2} />
                                <span className="text-[12px] text-[#F3ECE0]/80">No phone detected</span>
                            </>
                        )}
                    </button>
                </Glass>
            </div>

            <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(0.94); opacity: 0.75; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #F3ECE0;
          cursor: pointer;
          margin-top: -1px;
        }
      `}</style>
        </div>
    );
}

function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
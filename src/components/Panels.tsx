import React, { forwardRef } from "react";
import {
    Pause,
    Play,
    Settings,
    Volume2,
    VolumeX,
    SkipBack,
    SkipForward,
    X,
    Music2,
    Search,
    Loader2,
} from "lucide-react";

import type { useYouTubeMusicPlayer } from "../components/YoutubeMusicPlayer";

const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

type Background = {
    id: string;
    url: string;
    label: string;
};

type YouTubeMusicPlayer = ReturnType<typeof useYouTubeMusicPlayer>;

/* Small glass surface used across floating panels + pills */
export function Glass({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={
                "bg-white/[0.07] backdrop-blur-2xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.35)] " +
                className
            }
        >
            {children}
        </div>
    );
}

/* Music toggle trigger + its dropdown, ready to sit in a nav bar */
export const MusicButton = forwardRef<
    HTMLDivElement,
    {
        player: YouTubeMusicPlayer;
        apiKey: string | undefined;
        open: boolean;
        onToggleOpen: () => void;
        onClose: () => void;
    }
>(function MusicButton({ player, apiKey, open, onToggleOpen, onClose }, ref) {
    return (
        <div className="relative" ref={ref}>
            <button
                onClick={onToggleOpen}
                style={sans}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] backdrop-blur-xl transition-colors text-[13px] text-[#F3ECE0]/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECE0]/70"
                aria-label={player.musicOn ? "Music on — open controls" : "Music off — open controls"}
            >
                {player.musicOn ? (
                    <Volume2 className="w-[15px] h-[15px] text-[#E7A967]" strokeWidth={1.8} />
                ) : (
                    <VolumeX className="w-[15px] h-[15px] text-[#C9BFAF]" strokeWidth={1.8} />
                )}
                <span className="hidden sm:inline">Music</span>
            </button>

            {open && <MusicPanel player={player} apiKey={apiKey} onClose={onClose} />}
        </div>
    );
});

function MusicPanel({
    player,
    apiKey,
    onClose,
}: {
    player: YouTubeMusicPlayer;
    apiKey: string | undefined;
    onClose: () => void;
}) {
    return (
        <Glass className="absolute right-0 mt-2 w-80 rounded-2xl p-4 z-30 animate-[fadeIn_0.15s_ease-out]">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-[#C9BFAF] text-[11px] tracking-wider uppercase" style={sans}>
                    <Music2 className="w-3 h-3" strokeWidth={2} />
                    YouTube Music
                </div>
                <button
                    onClick={onClose}
                    className="text-[#C9BFAF] hover:text-[#F3ECE0] transition-colors"
                    aria-label="Stop and close"
                >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
            </div>

            {/* Search box */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    player.runSearch();
                }}
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-full bg-white/[0.06] border border-white/[0.12]"
            >
                <Search className="w-3.5 h-3.5 text-[#C9BFAF] shrink-0" strokeWidth={2} />
                <input
                    value={player.query}
                    onChange={(e) => player.setQuery(e.target.value)}
                    placeholder="Search YouTube for lo-fi, rain, café..."
                    style={sans}
                    className="w-full bg-transparent text-[13px] text-[#F3ECE0] placeholder:text-[#C9BFAF]/60 outline-none"
                    disabled={!apiKey}
                />
                {player.isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-[#E7A967] shrink-0 animate-spin" strokeWidth={2} />
                )}
            </form>

            {player.searchError && (
                <p className="text-[11px] text-[#D97B62] mb-3 leading-snug" style={sans}>
                    {player.searchError}
                </p>
            )}

            {/* Results */}
            {player.results.length > 0 && (
                <div className="mb-3 max-h-48 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                    {player.results.map((r, i) => (
                        <button
                            key={r.videoId}
                            onClick={() => player.selectResult(i)}
                            className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${i === player.resultIndex ? "bg-[#E7A967]/15" : "hover:bg-white/[0.06]"
                                }`}
                        >
                            <img
                                src={r.thumbnail}
                                alt=""
                                className="w-11 h-8 rounded object-cover shrink-0"
                            />
                            <span className="min-w-0">
                                <span
                                    className={`block text-[12.5px] truncate ${i === player.resultIndex ? "text-[#E7A967]" : "text-[#F3ECE0]/90"
                                        }`}
                                    style={sans}
                                >
                                    {r.title}
                                </span>
                                <span className="block text-[11px] text-[#C9BFAF]/70 truncate" style={sans}>
                                    {r.channelTitle}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Now playing + transport controls, once something is selected */}
            {player.currentTrack && (
                <>
                    <div className="flex items-center gap-3 mb-3 pt-3 border-t border-white/10">
                        <p
                            className="text-[13px] text-[#F3ECE0] leading-snug line-clamp-2"
                            style={{ ...serif, fontWeight: 400 }}
                        >
                            {player.currentTrack.title}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-5 mb-4">
                        <button
                            onClick={() => player.cycleResult(-1)}
                            className="text-[#F3ECE0]/70 hover:text-[#F3ECE0] transition-colors"
                            aria-label="Previous result"
                        >
                            <SkipBack className="w-4 h-4" strokeWidth={1.8} fill="currentColor" />
                        </button>
                        <button
                            onClick={player.togglePlayback}
                            className="w-9 h-9 rounded-full bg-[#E7A967]/90 hover:bg-[#E7A967] flex items-center justify-center transition-colors"
                            aria-label={player.musicOn ? "Pause music" : "Play music"}
                        >
                            {player.musicOn ? (
                                <Pause className="w-4 h-4 text-[#1a140a]" strokeWidth={2} fill="currentColor" />
                            ) : (
                                <Play className="w-4 h-4 text-[#1a140a] ml-0.5" strokeWidth={2} fill="currentColor" />
                            )}
                        </button>
                        <button
                            onClick={() => player.cycleResult(1)}
                            className="text-[#F3ECE0]/70 hover:text-[#F3ECE0] transition-colors"
                            aria-label="Next result"
                        >
                            <SkipForward className="w-4 h-4" strokeWidth={1.8} fill="currentColor" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-[#C9BFAF] shrink-0" strokeWidth={1.8} />
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={player.volume}
                            onChange={(e) => player.setVolume(Number(e.target.value))}
                            className="w-full h-1 rounded-full appearance-none bg-white/15 accent-[#E7A967] cursor-pointer"
                            aria-label="Volume"
                        />
                    </div>
                </>
            )}
        </Glass>
    );
}

/* Settings toggle trigger + its dropdown (background picker) */
export const SettingsButton = forwardRef<
    HTMLDivElement,
    {
        backgrounds: Background[];
        selectedId: string;
        onSelect: (bg: Background) => void;
        open: boolean;
        onToggleOpen: () => void;
    }
>(function SettingsButton({ backgrounds, selectedId, onSelect, open, onToggleOpen }, ref) {
    return (
        <div className="relative" ref={ref}>
            <button
                onClick={onToggleOpen}
                className="flex items-center justify-center w-[34px] h-[34px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] backdrop-blur-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3ECE0]/70"
                aria-label="Settings"
            >
                <Settings className="w-[15px] h-[15px] text-[#F3ECE0]/85" strokeWidth={1.8} />
            </button>

            {open && (
                <SettingsPanel
                    backgrounds={backgrounds}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            )}
        </div>
    );
});

function SettingsPanel({
    backgrounds,
    selectedId,
    onSelect,
}: {
    backgrounds: Background[];
    selectedId: string;
    onSelect: (bg: Background) => void;
}) {
    return (
        <Glass className="absolute right-0 mt-2 w-60 rounded-2xl p-4 z-30 animate-[fadeIn_0.15s_ease-out]">
            <p className="text-[#C9BFAF] text-[11px] tracking-wider uppercase mb-3" style={sans}>
                Room
            </p>
            <div className="grid grid-cols-3 gap-2">
                {backgrounds.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => onSelect(bg)}
                        className={`relative rounded-lg overflow-hidden aspect-square border transition-all ${selectedId === bg.id
                            ? "border-[#E7A967] ring-1 ring-[#E7A967]/60"
                            : "border-white/10 hover:border-white/30"
                            }`}
                        aria-label={bg.label}
                        title={bg.label}
                    >
                        <img src={bg.url} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </Glass>
    );
}
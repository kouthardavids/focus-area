import { X } from "lucide-react";

import { Glass } from "./Glass";

const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

export function TimerPanel({
    hours,
    minutes,
    seconds,
    onHoursChange,
    onMinutesChange,
    onSecondsChange,
    onSetTimer,
    onClose,
}: {
    hours: string;
    minutes: string;
    seconds: string;
    onHoursChange: (value: string) => void;
    onMinutesChange: (value: string) => void;
    onSecondsChange: (value: string) => void;
    onSetTimer: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Glass className="relative w-full max-w-sm rounded-2xl p-5 animate-[fadeIn_0.15s_ease-out]">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p
                            className="text-[#F3ECE0] text-[15px]"
                            style={{ ...serif, fontWeight: 400 }}
                        >
                            Set Timer
                        </p>
                        <p
                            className="text-[#C9BFAF]/70 text-[11px] mt-1"
                            style={sans}
                        >
                            Choose how long you want to study.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-[#C9BFAF] hover:text-[#F3ECE0] transition-colors"
                        aria-label="Close timer"
                    >
                        <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-5">
                    {/* Hours */}
                    <div className="flex-1">
                        <label
                            className="block text-[11px] text-[#C9BFAF]/70 mb-1.5"
                            style={sans}
                        >
                            Hours
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="999"
                            value={hours}
                            onChange={(e) => onHoursChange(e.target.value)}
                            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.12] px-3 py-2.5 text-[#F3ECE0] text-sm outline-none focus:border-[#E7A967]/60"
                            style={sans}
                        />
                    </div>

                    <span className="text-[#C9BFAF] text-lg mt-5">:</span>

                    {/* Minutes */}
                    <div className="flex-1">
                        <label
                            className="block text-[11px] text-[#C9BFAF]/70 mb-1.5"
                            style={sans}
                        >
                            Minutes
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => onMinutesChange(e.target.value)}
                            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.12] px-3 py-2.5 text-[#F3ECE0] text-sm outline-none focus:border-[#E7A967]/60"
                            style={sans}
                        />
                    </div>

                    <span className="text-[#C9BFAF] text-lg mt-5">:</span>

                    {/* Seconds */}
                    <div className="flex-1">
                        <label
                            className="block text-[11px] text-[#C9BFAF]/70 mb-1.5"
                            style={sans}
                        >
                            Seconds
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => onSecondsChange(e.target.value)}
                            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.12] px-3 py-2.5 text-[#F3ECE0] text-sm outline-none focus:border-[#E7A967]/60"
                            style={sans}
                        />
                    </div>
                </div>

                <button
                    onClick={onSetTimer}
                    className="w-full rounded-xl bg-[#E7A967]/90 hover:bg-[#E7A967] text-[#1a140a] py-2.5 text-[13px] transition-colors"
                    style={{ ...sans, fontWeight: 500 }}
                >
                    Set Timer
                </button>
            </Glass>
        </div>
    );
}
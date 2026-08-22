import React, { forwardRef } from "react";
import { Settings } from "lucide-react";
import type { Background } from "../../data/imageurls";

import { Glass } from "./Glass";

const sans = { fontFamily: "'Inter', sans-serif" };

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
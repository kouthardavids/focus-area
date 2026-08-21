import { useEffect } from "react";
const FONT_IMPORT_ID = "study-session-fonts";

export function useGoogleFonts() {
    useEffect(() => {
        if (document.getElementById(FONT_IMPORT_ID)) return;
        const link = document.createElement("link");
        link.id = FONT_IMPORT_ID;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&display=swap";
        document.head.appendChild(link);
    }, []);
}
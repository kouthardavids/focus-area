import { useState, useEffect, useRef, useCallback } from "react";

export type SearchResult = {
    videoId: string;
    title: string;
    channelTitle: string;
    thumbnail: string;
};

declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const YT_SCRIPT_ID = "youtube-iframe-api";

function decodeHtmlEntities(text: string): string {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
}

async function searchYouTube(
    query: string,
    apiKey: string
): Promise<SearchResult[]> {
    const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        maxResults: "10",
        q: query,
        key: apiKey,
    });
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );
    const data = await res.json();
    if (!res.ok) {
        const message =
            data?.error?.message || `Search failed (HTTP ${res.status})`;
        throw new Error(message);
    }
    return (data.items || [])
        .filter((item: any) => item.id?.videoId)
        .map((item: any) => ({
            videoId: item.id.videoId,
            title: decodeHtmlEntities(item.snippet.title),
            channelTitle: decodeHtmlEntities(item.snippet.channelTitle),
            thumbnail:
                item.snippet.thumbnails?.default?.url ||
                item.snippet.thumbnails?.medium?.url ||
                "",
        }));
}

function useYouTubeIframeApi() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setReady(true);
            return;
        }
        const prevCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prevCallback?.();
            setReady(true);
        };
        if (!document.getElementById(YT_SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = YT_SCRIPT_ID;
            script.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(script);
        }
    }, []);

    return ready;
}

export function useYouTubeMusicPlayer(apiKey: string | undefined) {
    const ytApiReady = useYouTubeIframeApi();

    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [resultIndex, setResultIndex] = useState<number | null>(null);
    const [musicOn, setMusicOn] = useState(false);
    const [volume, setVolume] = useState(62);

    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const playerReadyRef = useRef(false);
    const pendingVideoIdRef = useRef<string | null>(null);

    const currentTrack = resultIndex !== null ? results[resultIndex] : null;

    const handleTrackEnded = useCallback(() => {
        setResultIndex((i) => {
            if (i === null || results.length === 0) return i;
            const next = (i + 1) % results.length;
            const video = results[next];
            if (video && playerReadyRef.current) {
                playerRef.current?.loadVideoById(video.videoId);
            }
            return next;
        });
    }, [results]);

    useEffect(() => {
        if (!ytApiReady) return;
        if (!playerContainerRef.current) return;
        if (playerRef.current) return;

        playerRef.current = new window.YT.Player(playerContainerRef.current, {
            height: "90",
            width: "160",

            playerVars: {
                rel: 0,
                playsinline: 1,
            },

            events: {
                onReady: (event: any) => {
                    playerReadyRef.current = true;

                    event.target.setVolume(volume);

                    const pendingVideoId = pendingVideoIdRef.current;

                    if (pendingVideoId) {
                        event.target.loadVideoById({
                            videoId: pendingVideoId,
                        });

                        pendingVideoIdRef.current = null;
                    }
                },

                onStateChange: (event: any) => {
                    const YT = window.YT;

                    setMusicOn(event.data === YT.PlayerState.PLAYING);

                    if (event.data === YT.PlayerState.ENDED) {
                        handleTrackEnded();
                    }
                },

                onError: (event: any) => {
                    console.error("YouTube player error code:", event.data);
                },
            },
        });
    }, [ytApiReady]);

    // Keep the player's volume in sync with the slider.
    useEffect(() => {
        if (playerReadyRef.current) playerRef.current?.setVolume(volume);
    }, [volume]);

    const runSearch = useCallback(async () => {
        const q = query.trim();

        if (!q) return;

        if (!apiKey) {
            setSearchError("YouTube API key is missing.");
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const items = await searchYouTube(q, apiKey);

            setResults(items);
            setResultIndex(null);

            if (items.length === 0) {
                setSearchError("No results for that search.");
            }
        } catch (err: any) {
            setSearchError(
                err?.message || "Search failed. Check your API key and quota."
            );
        } finally {
            setIsSearching(false);
        }
    }, [query, apiKey]);

    const selectResult = useCallback(
        (idx: number) => {
            const video = results[idx];

            if (!video) return;

            setResultIndex(idx);

            if (!playerReadyRef.current || !playerRef.current) {
                pendingVideoIdRef.current = video.videoId;
                return;
            }

            playerRef.current.loadVideoById({
                videoId: video.videoId,
            });

            playerRef.current.playVideo();

            pendingVideoIdRef.current = null;
        },
        [results]
    );

    const togglePlayback = useCallback(() => {
        if (!playerReadyRef.current || !currentTrack) return;
        if (musicOn) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [musicOn, currentTrack]);

    const cycleResult = useCallback(
        (dir: 1 | -1) => {
            if (resultIndex === null || results.length === 0) return;
            const next = (resultIndex + dir + results.length) % results.length;
            selectResult(next);
        },
        [resultIndex, results, selectResult]
    );

    const stopMusic = useCallback(() => {
        playerRef.current?.stopVideo();
        setResultIndex(null);
    }, []);

    return {
        playerContainerRef,
        query,
        setQuery,
        isSearching,
        searchError,
        results,
        resultIndex,
        currentTrack,
        musicOn,
        volume,
        setVolume,
        runSearch,
        selectResult,
        togglePlayback,
        cycleResult,
        stopMusic,
    };
}
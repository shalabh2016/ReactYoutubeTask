// VideoPlayer Props and State
interface YTVPProps {
    videoId: string;
}

interface YTVPState {
    frameString: string;
    videoData: YTVResult;
}

// YouTube Video Api Result Model to Parse
interface YTVResult {
    kind: string;
    etag: string;
    items: Array<YTVItemArray>;
}

// Video Search Result
interface YouTubeVideoSearchResult {
    kind: string;
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Array<any>;
}

// YouTube Video Api Result Model to Parse
interface YTVItemArray {
    id: string;
    etag: string;
    kind: string;
    player: {
        embedHtml: string;
    };
    snippet: {
        categoryId: string;
        channelId: string;
        channelTitle: string;
        defaultAudioLanguage: string;
        description: string;
        liveBroadcastContent: string;
        localized: {
            title: string;
            description: string;
        }
        publishedAt: string;
        tags: Array<string>;
        thumbnails: YouTubeChannelThumbnail;
        title: string;
    };
}
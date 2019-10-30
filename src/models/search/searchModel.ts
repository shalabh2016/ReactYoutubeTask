// Intrface for Show Module
interface YouTubeSearchShow {
    id: string;
    channelId: string;
    title: string;
}

// Props interface
interface YouTubeSearchShowProps {
    searchResult: YouTubeSearchShow;
    openShow: any;
    handleCheck: any;
}

// State Interface
interface YouTubeSearchShowState {
}

// Search State
interface YouTubeSearchState {
    channelId: string;
    searchText: string;
    channelResult: Array<YouTubeSearchShow>;
    searchTempArray: Array<YouTubeSearchShow>;
    hiddenShowVideoId: Array<string>;
    checkShowList: Array<string>;
    isShowActive: boolean;
    isViewShowButtonDisabled: boolean;
}

// Search Props
interface YouTubeSearchProps {
}

// YouTube Search Api Result Model.
interface YouTubeSearchResult {
    kind: string;
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    regionCode: string;
    items: Array<YouTubeSearchResultItems>;
}

// YouTube Search Api Items array []
interface YouTubeSearchResultItems {
    etag: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        channelId: string;
        channelTitle: string;
        description: string;
        publishedAt: string;
        thumbnails: YouTubeChannelThumbnail;
        title: string;
    };
}
// Show Component State interface
interface YouTubeShowState {
    channelIdList: Array<string>;
    channelIdAndTokens: Array<ChannelIdAndTokenModel>;
    searchChannelResults: Array<YouTubeSearchResult>;
    paginatedChannelShows: Array<YouTubeSearchResultItems>;
    listWithHiddenChannelShows: Array<YouTubeSearchResultItems>;
    isRecentVideoButtonActivate: boolean;
    pageCount: number;
    offset: number;
    previousSelectedPageNo: number;
}

// Props Interface
interface YouTubeShowProps {
    hiddenShowVideoId: Array<string>;
    hideShow: any;
    channelIdList: Array<string>;
}

interface ChannelIdAndTokenModel{
    channelId: string;
    pageToken: string;
}

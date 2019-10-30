interface YTVideoCardState {
    isShow: boolean;
}

interface YTVideoCardProps {
    id: string;
    channelId: string;
    videoData: YouTubeSearchResultItems;
    hideClickHandler: any;
}
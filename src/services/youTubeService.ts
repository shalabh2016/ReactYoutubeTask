import { constructVideoUrl, constructSearchUrl } from '../static/ytStatic';

// YouTube Service for DRY code and operations on YouTube API.
export class YouTubeService {
    // Getting the Video from YouTube API (Construct Url from /static/yStatic.ts)
    async getVideo(videoId: string, apiKey: string): Promise<YouTubeVideoSearchResult> {
        return fetch(constructVideoUrl(videoId, apiKey))
            .then(res => res.json())
            .then((result) => {
                if (result)
                    return result;
            });
    }

    // Getting the Search Result from YouTube API (Construct Url from /static/yStatic.ts)
    async getSearchResult(channelId: string, apiKey: string, isPageToken: boolean, pageToken: string, limit: number): Promise<YouTubeSearchResult> {
        return fetch(constructSearchUrl(channelId, apiKey, isPageToken, pageToken, limit))
            .then(res => res.json())
            .then((result) => {
                if (result)
                    return result;
            });
    }

}
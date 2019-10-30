/**
 * Static like functions : Search Url. If isPageToken -> true then send Page Token.
 * This Api is for both Search Page and  will get Recent or Old Videos from <Shows/> component
 * Get 10 results everytime.
 */
export function constructSearchUrl(channelId: string, apiKey: string, isPageToken: boolean, pageToken: string, limit: number) {
    if (isPageToken) {
        return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&pageToken=${pageToken}&order=date&channelId=${channelId}&key=${apiKey}`;
    }
    return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&order=date&channelId=${channelId}&key=${apiKey}`;
}

// Get video from YouTube with VideoId and Api Key
export function constructVideoUrl(videoId: string, apiKey: string) {
    return `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=player,snippet,contentDetails&key=${apiKey}`;
}
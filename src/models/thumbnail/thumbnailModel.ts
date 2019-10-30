// Thumbnail Model
interface YouTubeChannelThumbnail {
    default: YouTubeThumbnailModel;
    high: YouTubeThumbnailModel;
    medium: YouTubeThumbnailModel;
}

interface YouTubeThumbnailModel {
    url: string;
}

import React from 'react';
import { YouTubeService } from '../../services/youTubeService';
import moment from 'moment';

// Getting YouTube Service which created for API Calling.
const yts = new YouTubeService();

// Getting ApiKey from .env file
const apiKey = process.env.YOUTUBE_API_KEY as string;

/**
 * This is a component for Video Player page after selecting
 * the show which you want to watch. Recieves VideoId from <Shows/> component as prop.
 */
export class VideoPlayer extends React.PureComponent<YTVPProps, YTVPState> {
    constructor(props: any) {
        super(props);
        this.state = {
            // Framestring is the <iframe></iframe> from YouTube Api.
            frameString: '',
            // VideoPlayer Data as YTVResult interface.
            videoData: {} as YTVResult
        };
    }

    transformDateTime(dT: string) {
        // Date from ISO to Human Readable from
        return moment(dT).utc().format('DD-MM-YYYY');
    }

    // Get Video iframe string from YouTube Rest API i.e. Embed
    async getVideoIFrame() {
        await yts.getVideo(this.props.videoId, apiKey).then((result) => {
            const state = {
                ...this.state, frameString: result.items[0].player.embedHtml,
                videoData: result
            };
            // Setting the state i.e. Video Data and player embed
            this.setState(state);
        });
    }

    componentDidMount() {
        // Get video from YouTube Api Rest
        this.getVideoIFrame();
    }

    render() {
        return (
            <div>
                {(this.state.videoData.items != null || this.state.videoData.items != undefined) ?
                    <div className='card'>
                        <p className='card-header'>
                            <div className='row'>
                                <div className='col-9 float-left'>
                                    <strong>{this.state.videoData.items[0].snippet.title}</strong>
                                </div>
                                <div className='col-3 float-right'>
                                    {`Published on: ${this.transformDateTime(this.state.videoData.items[0].snippet.publishedAt)}`}
                                </div>
                            </div>
                        </p>
                        <div className='card-body'>
                            <div className='card-text text-center' dangerouslySetInnerHTML={{ __html: this.state.frameString }}></div>
                            <hr />
                            <h5>Description</h5>
                            <p>{this.state.videoData.items[0].snippet.description}</p>
                        </div>
                    </div> : ''
                }
            </div>
        );
    }
}
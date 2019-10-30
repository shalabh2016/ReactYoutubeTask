import React from 'react';
import moment from 'moment';
import { VideoPlayer } from '../video/videoPlayer';

// VideoCard for the Shows from the channel : Search -> Show Page -> <VideoCard/>
export class VideoCard extends React.PureComponent<YTVideoCardProps, YTVideoCardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            /**
             * To Show the body of the Collapse component.
             * False -> Hide
             * True -> Show
             */
            isShow: false
        };

        this.toggleView = this.toggleView.bind(this);
    }

    transformDateTime(dT: string) {
        // Date from ISO to Human Readable from
        return moment(dT).utc().format('DD-MM-YYYY');
    }

    // Toggles state of 'isShow'.
    toggleView(): void {
        this.setState((current) => ({ ...current, isShow: !current.isShow }));
    }

    render() {
        return (
            <div id='accordion'>
                <div className='card'>
                    <div className='card-header' id={`heading${this.props.videoData.id.videoId}`}>
                        <h5 className='mb-0'>
                            <div className='row'>
                                <div className='col-11'>
                                    <button className='btn btn-link' data-toggle='collapse' onClick={this.toggleView} data-target={`#${this.props.videoData.id.videoId}`} aria-expanded='true' aria-controls={`${this.props.videoData.id.videoId}`}>
                                        <div className='row col-12'>
                                            <div className='float-left'>{this.props.videoData.snippet.title}</div>
                                            <div className='float-right'>Published Date: {this.transformDateTime(this.props.videoData.snippet.publishedAt)}</div>
                                        </div>
                                    </button>
                                </div>
                                <div className='col-1'>
                                    <button type='button' className='btn btn-danger' onClick={() => { this.props.hideClickHandler(this.props.videoData.id.videoId); }}>Hide</button>
                                </div>
                            </div>
                        </h5>
                    </div>
                    {
                        // Loades <VideoPlayer/> Component only when User clicks on button to show.
                        (this.state.isShow) ?
                            <div id={`${this.props.videoData.id.videoId}`} className={`collapse ${(this.state.isShow) ? 'show' : ''}`} aria-labelledby={`heading${this.props.videoData.id.videoId}`} data-parent='#accordion'>
                                <div className='card-body'>
                                    <VideoPlayer videoId={this.props.videoData.id.videoId} />
                                </div>
                            </div> : ''
                    }
                </div>
            </div>
        );
    }

}
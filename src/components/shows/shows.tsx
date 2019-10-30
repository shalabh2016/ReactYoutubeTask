import React from 'react';
import { YouTubeService } from '../../services/youTubeService';
import { VideoCard } from './videoCard';
import ReactPaginate from 'react-paginate';

// Getting YouTube Service which created for operations on YT Api.
const yts = new YouTubeService();

// Getting ApiKey from .env file
const apiKey = process.env.YOUTUBE_API_KEY as string;

// Show list renders VideoCard : Search -> Show
export class Shows extends React.PureComponent<YouTubeShowProps, YouTubeShowState> {
    constructor(props: any) {
        super(props);
        this.state = {
            // Channel Show Result the global list
            searchChannelResults: new Array<YouTubeSearchResult>(),
            // Getting Channel Id from url
            channelIdList: props.channelIdList,
            // Channel List with tht the Channel Id and Token Model.
            channelIdAndTokens: new Array<ChannelIdAndTokenModel>(),
            // Channel List filtered by Channel List
            paginatedChannelShows: new Array<YouTubeSearchResultItems>(),
            // List with hidden shows
            listWithHiddenChannelShows: new Array<YouTubeSearchResultItems>(),
            // To Activate previous button
            isRecentVideoButtonActivate: false,
            pageCount: 0,
            offset: 0,
            previousSelectedPageNo: 0
        };

        this.searchYT = this.searchYT.bind(this);
        this.removeShows = this.removeShows.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.getSearchList = this.getSearchList.bind(this);
        this.youTubeGetPrevOrNext = this.youTubeGetPrevOrNext.bind(this);
    }

    componentDidMount() {
        // Getting the Search list -> from YouTube Rest Api on Mount
        this.searchYT(false, false, false);
    }

    // Updating the <Shows/> component based on ChannelId prop from <Search/> component.
    componentWillReceiveProps(nextProps: any) {
        if (nextProps.channelIdList !== this.state.channelIdList) {
            this.setState(
                (current) =>
                    ({ ...current, channelIds: nextProps.channelIdList }),
                () => this.searchYT(false, false, false));
        }
    }

    // Recent and Old button
    youTubeGetPrevOrNext(selected: number): void {
        /**
         * Getting Old and Recent Videos @ 10 videos each.
         * Selected -> 2 -> Old Page
         * Selected -> 1 -> Recent Page
         */
        if (selected === 2) {
            // NextPage token from YouTube Api
            this.searchYT(true, true, false);
        } else if (selected === 1 && this.state.isRecentVideoButtonActivate) {
            // PrevPage Token from YouTube Api
            if (this.state.searchChannelResults[0].prevPageToken != null || this.state.searchChannelResults[0].prevPageToken != undefined) {
                let key = this.state.searchChannelResults[0].prevPageToken;
                // If the most recent page is in order then disable Recent button
                if (key === null || key === undefined || !key) {
                    this.setState((current) => ({ ...current, isRecentVideoButtonActivate: false }));
                    this.forceUpdate();
                    return;
                }
                this.searchYT(true, false, true);
            } else {
                // If the most recent page is in order then disable Recent button
                this.setState((current) => ({ ...current, isRecentVideoButtonActivate: false }));
            }
        }
    }

    // Pagination handler
    handlePageClick(data: any) {
        let selected = data.selected;
        let offset = Math.ceil(selected * 10);

        let tempArray = this.state.listWithHiddenChannelShows;

        let begin = ((selected) * 10);
        let end = begin + 10;

        tempArray = tempArray.slice(begin, end);

        this.setState((current) =>
            ({
                ...current, offset: offset,
                paginatedChannelShows: tempArray,
                previousSelectedPageNo: selected
            }));
    }

    // Search from YouTube -> Search Rest API
    async searchYT(isPageToken: boolean, isNextPageToken: boolean, isPreviousPageToken: boolean): Promise<void> {
        /**
         * If Page Token exists -> then send pageToken
         * See -> static/ytStatic.ts or YouTubeService api.
         */
        let list = new Array<ChannelIdAndTokenModel>();

        if (isPageToken) {
            // If Next Page then go through this.
            if (isPageToken && isNextPageToken && !isPreviousPageToken) {
                this.setState((current) => ({ ...current, isRecentVideoButtonActivate: true }));
                // Building the list of channels in ChannelIdToken so that later we can call YT Api
                this.state.searchChannelResults.forEach((key) => {
                    let channelId = '';
                    key.items.forEach((item) => channelId = item.snippet.channelId);
                    list.push({
                        channelId: channelId,
                        pageToken: key.nextPageToken
                    });
                });
            }

            // If Previous Page then go through this
            if (isPageToken && !isNextPageToken && isPreviousPageToken) {
                // Building the list of channels in ChannelIdToken so that later we can call YT Api
                this.state.searchChannelResults.forEach((key) => {
                    let channelId = '';
                    key.items.forEach((item) => channelId = item.snippet.channelId);
                    list.push({
                        channelId: channelId,
                        pageToken: key.prevPageToken
                    });
                });
            }
        } else {
            // If no previous or next page tokens this will run and when isPageToken === false
            this.state.channelIdList.forEach((channelId) => {
                list.push({
                    channelId: channelId,
                    pageToken: ''
                });
            });
        }

        // Clearing previous SearchChannelResult list
        this.setState((current) =>
            ({ ...current, searchChannelResults: new Array<YouTubeSearchResult>(), pageCount: 0 }));

        // Setting ChannelIdAndToken List
        this.setState((current) =>
            ({ ...current, channelIdAndTokens: list }),
            () => this.getSearchList(isPageToken));

    }

    async getSearchList(isPageToken: boolean): Promise<void> {

        // Iteration over Channel id and token list to get the Search Result
        this.state.channelIdAndTokens.forEach((channel) => {
            // YouTube Api do not support more than this.
            let limit = 50;

            // Getting Result from YouTube Service Api.
            yts.getSearchResult(channel.channelId, apiKey, isPageToken, channel.pageToken, limit)
                .then((result) => {
                    let newResult = this.state.searchChannelResults;
                    newResult.push(result);
                    this.setState((current) =>
                        ({
                            ...current,
                            searchChannelResults: newResult
                        }));
                    if (this.state.channelIdAndTokens.length === this.state.searchChannelResults.length) {
                        this.removeShows();
                    }
                });
        });
    }

    // Remove shows from array. And setting listWithHiddenChannelShows.
    async removeShows() {
        /**
         * For simplicity and using this array to copy all 'items' (array)
         * to tempHiddenarray
         */
        let tempHiddenArray = new Array<YouTubeSearchResultItems>();
        this.state.searchChannelResults.forEach((keys) => {
            keys.items.forEach((values) => {
                tempHiddenArray.push(values);
            });
        });

        /**
         * Filtering Array where hiddenShowVideoId includes VideoId
         * Also sorting the list according to the published data-time
         */
        tempHiddenArray = tempHiddenArray.sort(
            (a, b) => {
                let aTime = Date.parse(a.snippet.publishedAt);
                let bTime = Date.parse(b.snippet.publishedAt);
                return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
            })
            .filter((items) =>
                //  If videoId in hiddenVideoIdlist do not exists then push otherwise skip
                !this.props.hiddenShowVideoId.includes(items.id.videoId)
            );

        // For the first time.
        let tempPageNo = this.state.pageCount;

        // Setting the Array without the Hidden shows
        this.setState((current) => ({
            ...current,
            listWithHiddenChannelShows: tempHiddenArray,
            /**
             * tempHiddenArray for one channel = 50 (Limit).
             * So for one channel selected = 50
             * and Length = (No of Channel selected) * 50.
             * So pageCount = Length/10. So pages will be in multiple of 5
             * i.e. 5,10,15....
             * but in this task only 3 channel max = so max length = 15
             */
            pageCount: Math.ceil(tempHiddenArray.length / 10)
        }));

        // If pageCount === 0 then call handleClick for pagination.
        if (tempPageNo === 0) {
            this.handlePageClick({ selected: 0 });
        }

    }

    render() {
        return (
            <div>
                <div className='m-3 text-center justify-content-center'>
                    <div className='m-3 row col d-flex justify-content-center'>
                        <div className='row'>
                            <button type='button' className='btn btn-dark m-2' disabled={!this.state.isRecentVideoButtonActivate} onClick={() => this.youTubeGetPrevOrNext(1)}>Recent Videos</button>
                            <button type='button' className='btn btn-info m-2' onClick={() => this.youTubeGetPrevOrNext(2)}>Old Videos</button>
                        </div>
                    </div>
                    <div className='row m-2 col d-flex justify-content-center'>
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-link'}
                            nextClassName={'page-link'}
                            previousLinkClassName={'page-item'}
                            nextLinkClassName={'page-item'}
                            initialPage={0}
                        />
                    </div>

                </div>
                {
                    /**
                     * Renders the List of Shows on <VideoCard /> Component.
                     * Do not show Hidden shows.
                     */
                    (this.state.paginatedChannelShows[0] != null || this.state.paginatedChannelShows[0] != undefined) ?
                        (this.state.paginatedChannelShows.map((item) => {
                            if (item.id.videoId != null || item.id.videoId != undefined) {
                                return (<div key={item.id.videoId}>
                                    <VideoCard id={item.id.videoId} hideClickHandler={() => this.props.hideShow(item.id.videoId, this.state.previousSelectedPageNo)} videoData={item} channelId={item.snippet.channelId} />
                                </div>);
                            }
                        }))
                        : <div><p>You do not have videos in this list. Press Old or Recent button to load more videos</p><p>Or there is some problem with YouTube API may be its daily limit is exhausted.</p></div>}
            </div>
        );
    }
}

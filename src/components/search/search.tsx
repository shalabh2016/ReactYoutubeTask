import React from 'react';
import { SearchResult } from './searchResult';
import { Shows } from '../shows/shows';

// For Search String. Search Text (sT)
let sT = '';

// <Search/> Component - Act as Root Component.
export class Search extends React.PureComponent<YouTubeSearchProps, YouTubeSearchState> {
    shows: React.RefObject<Shows>;

    constructor(props: any) {
        super(props);

        this.state = {
            channelId: '',
            searchText: '',
            // Channel List Array
            channelResult: new Array<YouTubeSearchShow>(),
            // Search filtered Array
            searchTempArray: new Array<YouTubeSearchShow>(),
            // List for hidden videos or shows
            hiddenShowVideoId: new Array<string>(),
            // Checked List for the id of checked show.
            checkShowList: new Array<string>(),
            isShowActive: false,
            isViewShowButtonDisabled: true
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.constructResult = this.constructResult.bind(this);
        this.setSearchedList = this.setSearchedList.bind(this);
        this.hideShow = this.hideShow.bind(this);
        this.openShow = this.openShow.bind(this);
        this.handleCheck = this.handleCheck.bind(this);

        // A Reference to <Shows /> component
        this.shows = React.createRef();
    }

    // Setting the Search Text / To Filter
    handleInputChange(event: any): void {
        sT = event.target.value;
    }

    // Setting select/deselect the show
    async handleCheck(channelId: string): Promise<void> {
        let tempCheckList = this.state.checkShowList;
        if (tempCheckList.includes(channelId)) {
            tempCheckList = tempCheckList.filter(channel => channel !== channelId);
            return this.setState((current) => ({ ...current, checkShowList: tempCheckList, isShowActive: false }));
        }

        tempCheckList.push(channelId);
        this.setState((current) => ({ ...current, checkShowList: tempCheckList, isViewShowButtonDisabled: false, isShowActive: false }), () => this.forceUpdate());
    }

    // Constructing Channel List (Hard Coded) as given in the email.
    async constructResult(): Promise<void> {
        let channel = [{
            id: 'UCVTyTA7-g9nopHeHbeuvpRA',
            channelId: 'UCVTyTA7-g9nopHeHbeuvpRA',
            title: 'Late Night with Seth Meyers'
        }, {
            id: 'UCwWhs_6x42TyRM4Wstoq8HA',
            channelId: 'UCwWhs_6x42TyRM4Wstoq8HA',
            title: 'The Daily Show with Trevor Noah'
        }, {
            id: 'UCMtFAi84ehTSYSE9XoHefig',
            channelId: 'UCMtFAi84ehTSYSE9XoHefig',
            title: 'The Late Show with Stephen Colbert'
        }] as Array<YouTubeSearchShow>;

        // Setting the state of the Channel List
        this.setState((current) => ({ ...current, channelResult: current.channelResult.concat(channel) }));
    }

    // Now setting and starting the Search List (Filtered list)
    async handleSubmit(): Promise<void> {
        this.setState((current) => ({ ...current, searchText: sT, searchTempArray: new Array<YouTubeSearchShow>() }));
        await this.setSearchedList();
    }

    /**
     * Setting the Search List or Filtered List
     * Matching the Filtering the array with Search Text (sT)
     */
    async setSearchedList(): Promise<void> {
        let list = this.state.channelResult.filter(channel => channel.title.toLowerCase().includes(sT.toLowerCase()));
        this.setState((current) => ({ ...current, searchText: sT, searchTempArray: current.searchTempArray.concat(list) }));
    }

    // Opening <Shows/> Component with Selected Channel list
    async openShow(): Promise<void> {
        this.setState((current) => ({ ...current, isShowActive: true }));
    }

    // Setting VideoId to Hide from aray.
    async hideShow(videoId: string, pageNo: number): Promise<void> {
        if (this.state.hiddenShowVideoId.includes(videoId)) {
            return;
        }

        /**
         * Need to create Temp as the state is not directly mutable,
         * or it is dangerous to set directly.
         */
        let tempArray = this.state.hiddenShowVideoId;
        tempArray.push(videoId);

        // Setting the state of Video id array list
        this.setState((current) => ({ ...current, hiddenShowVideoId: tempArray }),
            async () => {
                // Removing Shows from the from <Shows/> Component
                if (this.shows.current != null || this.shows.current != undefined) {
                    await this.shows.current.removeShows().then(() => {
                        if (this.shows.current != null || this.shows.current != undefined) {
                            this.shows.current.handlePageClick({ selected: pageNo });
                        }
                    });
                }

            });
    }

    componentDidMount() {
        this.constructResult();
    }

    render() {
        return (
            <div>
                <div className='row col mt-5'>
                    <h3><label htmlFor='lastName'>Search</label></h3>
                    <input type='text' className='form-control' id='searchInput' name='searchInput' onChange={this.handleInputChange} placeholder='Enter search' />
                    <button type='button' className='mt-3 text-center btn btn-dark' onClick={this.handleSubmit} >Search</button>
                </div>
                <div className='col mt-3'>
                    <hr />
                    {
                        /**
                         * If Searched Array exists then it will render this.
                         * Otherwise render Default Channel Array
                         * Renders <SearchRsult/> component
                         */
                        (this.state.searchTempArray.length > 0) ?
                            this.state.searchTempArray.map((channel) => <div key={channel.id}><SearchResult handleCheck={this.handleCheck} searchResult={channel} openShow={this.openShow} /></div>) :
                            (this.state.channelResult != null || this.state.channelResult != undefined) ?
                                this.state.channelResult.map((channel) => <div key={channel.id}><SearchResult handleCheck={this.handleCheck} searchResult={channel} openShow={this.openShow} /></div>) : ''
                    }
                </div>
                <hr />
                {
                    (this.state.checkShowList.length === 0 || this.state.checkShowList === null || this.state.checkShowList === undefined) ?
                        <h5>Please select one of the show.</h5>
                        :
                        (!this.state.isViewShowButtonDisabled) ?
                            <div className='row justify-center'>
                                <button className='btn btn-success' onClick={this.openShow}>View Shows</button>
                            </div> : ''
                }
                <hr />
                {
                    // This will render <Shows/> component.
                    (this.state.isShowActive && this.state.checkShowList.length > 0) ?
                        <div className='col mt-3'>
                            <Shows ref={this.shows} channelIdList={this.state.checkShowList} hiddenShowVideoId={this.state.hiddenShowVideoId} hideShow={this.hideShow} />
                        </div> : <p>Select shows to view the shows list. (10 Videos per page)</p>
                }
            </div>
        );
    }
}
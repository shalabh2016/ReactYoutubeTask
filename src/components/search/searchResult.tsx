import React from 'react';

// Search List Rendering Component. Search -> Render Array -> <SearchResult/> Component
export class SearchResult extends React.PureComponent<YouTubeSearchShowProps, YouTubeSearchShowState> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='list-group' key={this.props.searchResult.id}>
                <div className='list-group-item list-group-item-action'>
                    <div className='row'>
                        <div className='col-1'>
                            <input type='checkbox' defaultChecked={false} onChange={() => this.props.handleCheck(this.props.searchResult.channelId)} />
                        </div>
                        <div className='col-11'>
                            <h5 className='mb-1'>{this.props.searchResult.title}</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import { Search } from '../search/search';

// Navigation Component -> Navigation bar -> Home Page
export class Navigation extends React.PureComponent {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div className='d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm'>
                    <h5 className='my-0 mr-md-auto font-weight-normal'>ReactApp YouTube</h5>
                    <nav className='my-2 my-md-0 mr-md-3'>
                        <Link className='p-2 text-dark' to='/search'>Search</Link>
                    </nav>
                </div>
                <div className='container'>
                    <Switch>
                        <Route path='/search'>
                            <Search />
                        </Route>
                        <Redirect exact from='/' to='/Search' />
                    </Switch>
                </div>
            </Router>
        );
    }
}
import React from 'react';
import { Navigation } from './navigation/navigation';

class App extends React.PureComponent {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <Navigation />
        );
    }
}

export default App;
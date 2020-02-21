import React, { useEffect } from 'react';
import moment from 'moment';

import TrackList from './TrackList';
import usePrevious from './../utils/usePrevious';

const App = () => {

    const [trackTitle, setTrackTitle] = React.useState('');
    const [trackList, setTrackList] = React.useState([]); 

    const onRefreshHandler = React.useCallback(() => {
        localStorage.setItem('tracks', JSON.stringify(trackList));
    },[trackList])

    const prevOnRefreshHandler = usePrevious(onRefreshHandler);

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem('tracks')) || [];
        if (storage) {
            setTrackList(storage)
        }
    }, []);

    useEffect(() => {
        window.removeEventListener('beforeunload', prevOnRefreshHandler);
        window.addEventListener('beforeunload', onRefreshHandler);
        return () => window.removeEventListener('beforeunload', onRefreshHandler);
    }, [onRefreshHandler])

    const changeHandler = React.useCallback(({ target }) => setTrackTitle(target.value), []);

    const clickHandler = React.useCallback(() => {

        const id = Math.random()
            .toString(36)
            .substr(2, 9);
        const date = moment();
        let title;

        if (!trackTitle) {
            title = date.format('L (kk:mm:ss)');
        } else {
            title = trackTitle;
        }

        const newTrack = {
            id,
            title,
            timerStart: date.valueOf(),
            timerPause: null,
            isPlaying: false,
        }

        const newTrackList = [newTrack].concat(trackList);

        setTrackList(newTrackList);
        setTrackTitle('');

    }, [trackTitle, trackList]);

    const deleteTrack = React.useCallback((id) => {
        const updatedList = trackList.filter(track => track.id !== id)
        setTrackList(updatedList)
    }, [trackList])

    return (
        <div className="app">
            <h1>Tracker</h1>
            <div className="input-field">
                <input value={trackTitle} onChange={changeHandler} />
                <button className="button" onClick={clickHandler} >Add</button>
            </div>
            <TrackList {...{ trackList, deleteTrack }} />
        </div>
    )
};

export default App;
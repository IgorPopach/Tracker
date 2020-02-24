import React, { useEffect } from 'react';
import moment from 'moment';

import TrackItem from './TrackItem';
import usePrevious from './../utils/usePrevious';

const App = () => {

    const [trackTitle, setTrackTitle] = React.useState('');
    const [trackList, setTrackList] = React.useState([]);

    const onRefreshHandler = React.useCallback(() => {
        localStorage.setItem('tracks', JSON.stringify(trackList));
    }, [trackList])

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
    }, [onRefreshHandler]);

    const changeHandler = React.useCallback(({ target }) => setTrackTitle(target.value), []);

    const saveTrack = React.useCallback(() => {

        const id = Math.random()
            .toString(36)
            .substr(2, 9);
        let title;

        if (!trackTitle) {
            title = moment().format('L (kk:mm:ss)');
        } else {
            title = trackTitle;
        }

        const newTrack = {
            id,
            title,
            periods: [],
            isPlaying: false,
        }

        setTrackList((prevState) => [newTrack, ...prevState]);
        setTrackTitle('');

    }, [trackTitle]);

    const onDeleteTrack = React.useCallback((id) => {
        const updatedList = trackList.filter(track => track.id !== id)
        setTrackList(updatedList)
    }, [trackList]);

    const onUpdateTrack = React.useCallback((updatedTrack) =>
        setTrackList((prevState) => prevState.map(track => {
            if (track.id === updatedTrack.id) {
                return updatedTrack
            }
            return track;
        })), []);

    return (
        <div className="app">
            <h1>Tracker</h1>
            <div className="input-field">
                <input value={trackTitle} onChange={changeHandler} maxLength="15" />
                <button className="button" onClick={saveTrack} ><span></span></button>
            </div>
            <ul className="track-list">
                {trackList.map(track => {
                    const storedDuration = track.periods.reduce((prevValue, period ) => {
                        if(period.stop) {
                            return period.stop - period.start + prevValue
                        } else {
                            return moment().valueOf() - period.start + prevValue
                        }
                    }, 0)
                    return <TrackItem key={track.id} {...{ track, onDeleteTrack, onUpdateTrack, storedDuration }} />
                })}
            </ul>
        </div>
    )
};

export default App;
import React from 'react';
import moment from 'moment';

import formatTime from './../utils/formatTime';



const stopPeriods = (track) => track.periods.map(period => {
    if (period.stop === null) {
        period.stop = moment().valueOf();
    };
    return period;
});

const trackWithNewPeriod = (track) => {

    const period = {
        start: moment().valueOf(),
        stop: null,
    };

    return {
        ...track,
        periods: [...stopPeriods(track), period],
        isPlaying: true,
    };

}

const trackWithStopPeriod = (track) => ({
    ...track,
    periods: stopPeriods(track),
    isPlaying: false,
});

const TrackItem = ({ track, onDeleteTrack, onUpdateTrack, storedDuration }) => {
    const [duration, setDuration] = React.useState(0);
    const [isActive, setIsActive] = React.useState(track.isPlaying);

    let interval = null;

    const classes = React.useMemo(() => {
        if (isActive) {
            return 'playing'
        };
        return 'pause';
    }, [isActive]);

    React.useEffect(() => {
        setDuration(storedDuration);
    }, [storedDuration]);

    React.useEffect(() => {

        if (isActive) {
            interval = window.setInterval(() => {
                setDuration(prevState => prevState + 1000);
            }, 1000);
            onUpdateTrack(trackWithNewPeriod(track));
        } else if (!isActive && duration !== 0) {
            window.clearInterval(interval);
            onUpdateTrack(trackWithStopPeriod(track));
        }

        return () => window.clearInterval(interval);

    }, [isActive]);

    const togglePlaying = React.useCallback(() => setIsActive((prevState) => !prevState), [isActive]);

    const clickHandler = React.useCallback(() => onDeleteTrack(track.id), []);

    return (
        <li className={`track-item ${classes}`} >
            <span className="title" >{track.title}</span>
            <div className="control-panel">
                <span>
                    {formatTime(duration)}
                </span>
                <button className="btn" onClick={togglePlaying}>
                    <div className={classes}></div>
                </button>
                <button className="btn delete" onClick={clickHandler}><span></span></button>
            </div>
        </li>
    )
}

export default TrackItem;
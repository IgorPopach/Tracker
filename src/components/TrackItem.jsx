import React from 'react';

import formatTime from './../utils/formatTime';

const TrackItem = ({ track, deleteTrack }) => {
    const [duration, setDuration] = React.useState(0);
    const [isActive, setIsActive] = React.useState(track.isPlaying);

    const classes = React.useMemo(() => {
        if(isActive) {
            return 'playing'
        };
        return 'pause';
    }, [isActive]);

    React.useEffect(() => {
        let interval = null;
        if (isActive) {
          interval = window.setInterval(() => {
            setDuration(prevState => prevState + 1);
          }, 1000);
        } else if (!isActive && duration !== 0) {
          window.clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [isActive, duration]);

    const togglePlaying = React.useCallback(() => {
        setIsActive((prevState) => !prevState);
    }, [isActive]);

    const clickHandler = () => deleteTrack(track.id);

    return (
        <li className="track-item" >
            {track.title}
            <span>
                {formatTime(duration)}
            </span>
            <div>
                <button className="btn" onClick={togglePlaying}>
                    <div className={classes}></div>
                </button>
                <button className="btn delete" onClick={clickHandler}><span></span></button>
            </div>
        </li>
    )
}

export default TrackItem;
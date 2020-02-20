import React from 'react';

import TrackItem from './TrackItem';

const TrackList = ({ trackList, deleteTrack }) => {


    return (
        <ul className="track-list">
            {trackList.map(track => {
                return <TrackItem key={track.id} {...{track, deleteTrack}} />
            })}
        </ul>
    )
}

export default TrackList;
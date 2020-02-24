import React from 'react';

import TrackItem from './TrackItem';

const TrackList = ({ trackList, deleteTrack, updateTrack }) => {

    return (
        <ul className="track-list">
            {trackList.map(track => {
                return <TrackItem key={track.id} {...{track, deleteTrack, updateTrack}} />
            })}
        </ul>
    )
}

export default TrackList;
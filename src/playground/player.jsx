import PropTypes from 'prop-types';
import React from 'react';
// import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {compose} from 'redux';

import Box from '../components/box/box.jsx';
import GUI from '../containers/gui-player.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import AppStateHOC from '../lib/app-state-player-hoc.jsx';

import {setPlayer} from '../reducers/mode';
import styles from './player.css';

const Player = ({isPlayerOnly, projectId, username, assetHost}) => (
    <Box className={styles.stageOnly}>
        <GUI
            isPlayerOnly={isPlayerOnly}
            projectId={projectId}
            username={username}
            assetHost={assetHost}
        />
    </Box>
);

Player.propTypes = {
    isPlayerOnly: PropTypes.bool,
    username: PropTypes.string,
    assetHost: PropTypes.string,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    onSeeInside: () => dispatch(setPlayer(false))
});

const ConnectedPlayer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedPlayer = compose(
    AppStateHOC,
    HashParserHOC
)(ConnectedPlayer);
window.WrappedPlayer = WrappedPlayer;

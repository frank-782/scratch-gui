import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import StageWrapper from '../../containers/stage-wrapper.jsx';
import Box from '../box/box.jsx';

import WebGlModal from '../../containers/webgl-modal.jsx';

import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        children,
        isFullScreen,
        isRtl,
        loading,
        stageSizeMode,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);
        return (
            <React.Fragment>
                {isRendererSupported ? null : <WebGlModal isRtl={false} />}
                <StageWrapper
                    isFullScreen={isFullScreen}
                    isRendererSupported={isRendererSupported}
                    isRtl={isRtl}
                    loading={loading}
                    stageSize={STAGE_SIZE_MODES.large}
                    vm={vm}
                />
            </React.Fragment>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    children: PropTypes.node,
    isPlayerOnly: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
    username: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    autoSaveIntervalSecs: PropTypes.number
};
GUIComponent.defaultProps = {
    username: '',
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));

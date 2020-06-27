import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './user-avatar.css';

const UserAvatar = ({
    className,
    imageUrl,
    title
}) => (
    <img
        className={classNames(
            className,
            styles.userThumbnail
        )}
        title={title}
        src={imageUrl}
    />
);

UserAvatar.propTypes = {
    className: PropTypes.string,
    imageUrl: PropTypes.string,
    title: PropTypes.string
};

export default UserAvatar;

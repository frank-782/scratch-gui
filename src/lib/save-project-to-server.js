import queryString from 'query-string';
// eslint-disable-next-line no-unused-vars
import storage from '../lib/storage';
import log from './log';

/**
 * Save a project JSON to the project server.
 * This should eventually live in scratch-www.
 * @param {number} projectId the ID of the project, null if a new project.
 * @param {object} vmState the JSON project representation.
 * @param {object} params the request params.
 * @property {?number} params.originalId the original project ID if a copy/remix.
 * @property {?boolean} params.isCopy a flag indicating if this save is creating a copy.
 * @property {?boolean} params.isRemix a flag indicating if this save is creating a remix.
 * @property {?string} params.title the title of the project.
 * @return {Promise} A promise that resolves when the network request resolves.
 */
export default function (projectId, vmState, params) {
    const opts = {
        data: vmState,
        // If we set json:true then the body is double-stringified, so don't
        headers: {
            'Content-Type': 'application/json'
        },
        validateStatus: () => true,
        withCredentials: true
    };
    const queryParams = {};
    if (params.hasOwnProperty('isCopy')) queryParams.isCopy = true;
    if (params.hasOwnProperty('isRemix')) queryParams.isRemix = true;
    let qs = queryString.stringify(queryParams);
    log.debug(params);
    if (qs) qs = `?${qs}`;
    Object.assign(opts, {
        method: 'put',
        // url: `${storage.projectHost}/${projectId}${qs}`
        url: `${location.origin}/project/${projectId || params.originalId}/upload${qs}`
    });
    const loading = window.scratchExt.loading || {};
    const axios = window.scratchExt.axios || {};
    const showWarn = window.scratchExt.alert.warn || {};
    loading.start();
    return new Promise((resolve, reject) => {
        axios(opts)
            .then(response => {
                log.debug(response);
                if (response.status !== 200){
                    loading.end();
                    const data = response.data;
                    if (data.message) showWarn(data.message);
                    return reject(response.status);
                }
                let body;
                try {
                // Since we didn't set json: true, we have to parse manually
                    body = response.data;
                } catch (e) {
                    loading.end();
                    return reject(e);
                }
                loading.end();
                resolve(body);
            })
            .catch(error => {
                loading.end();
                reject(error);
            });
    });
}

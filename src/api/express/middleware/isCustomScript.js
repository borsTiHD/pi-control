/**
 * Validating paths: Tests if file is in 'custom' directory
 * Only 'custom' scripts are allowed
 * @param {String} path - path to validate
 * @returns {Boolean} - 'True': 'path' points to custom directory; 'False': 'path' is not pointing to the custom directory
 */
const isCustomScript = (path) => {
    // Validates folder structure
    // Returns true, if the custom path is in there
    return /^scripts\\custom\\/gm.test(path) /* win path */ || /^scripts\/custom\//gm.test(path) /* linux path */
}

export default isCustomScript

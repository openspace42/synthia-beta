
/** 
 * this represents any result
 * 
 * @since 0.2
 * @author Gianfracesco Aurecchia <gianfri@aurecchia.it>
 * @version 1.0
 * 
 * @class StatusResult
 * @type {Object}
 * @property {number} state                     return a stats of inizialization,
 *                                              cases:
 *                                              0: all OK, result.message contins a true message
 *                                              1: not all is ok but the program can continue in result.message you can found the error
 *                                              2: the error is critical, the program exit, you can found a error in result.message
 * @property {string} message                  rapprenste a result message           
 */
function StatusResult(state, message) {
    return {
        state: state,
        message: message
    };
}

module.exports = StatusResult;
/*
Openspace42     https://github.com/openspace42

author          Gianfracesco Aurecchia
git             https://github.com/GianfriAur

License         https://github.com/openspace42/LibreLicense
*/

'use strict';
/** 
 * @returns {Function} a SyntiaUid function
 */
var SyntiaUid = (() => {
    /**
     * return a uid formatted : "syntia{-[prefix]}{-xxxxxxxx}*[block]"
     * example SyntiaUid(4,"myP") => syntia-myP-12345678-12345678-12345678-12345678
     * @param {number} block a number of uid blocks
     * @param {string} prefix a prefix
     * @returns {string} a uid.
     */
    function SyntiaUid(block, prefix = "") {
        var path = "syntia" + (prefix == "" ? "" : "-" + prefix) + ("-xxxxxxxx".repeat(block));
        return path.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    return SyntiaUid;
})();
module.exports=SyntiaUid;
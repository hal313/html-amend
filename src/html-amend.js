((module) => {
    'use strict';

    /**
     * Determines if a value is defined (not undefined and not null).
     *
     * @param {*} value the value to check
     * @returns true if the value is not undefined and not null; false otherwise
     */
    const isDefined = (value) => {
        return undefined !== value && null !== value;
    };

    /**
     * Throws an error if the parameter is not defined.
     *
     * @param {*} parameter the parameter to verify
     * @param {String} parameterName the parameter name
     * @param {String} functionName the function name
     * @throws {String} if the parameter is not defined
     */
    const verifyParameterIsDefined = (parameter, parameterName, functionName) => {
        if (!isDefined(parameter)) {
            throw `Parameter "${parameterName}" must be defined for function "${functionName}"`;
        }
    };

    /**
     * Ensures that the passed in value (string or RegExp) is returned as a RegExp instance.
     *
     * @param {String|RegExp} regExp the regular expression to check
     * @returns a RegExp instance; either the passed in RegExp, or a case insensitive RegExp based on the string value passed in
     */
    const normalizeRegExp = (regExp) => {
        verifyParameterIsDefined(regExp, 'regExp', normalizeRegExp.name);

        return regExp instanceof RegExp ? regExp : new RegExp(regExp, 'i');
    };

    /**
     * Normalizes a value; if the value is a function, the function is executed and the result is returned. If the
     * resultant is a value, then the resultant will be executed. Rinse and repeat until the value is not a function.
     *
     * @param {*|Function} value the value to normalize
     * @returns {*} a value (not a function)
     */
    const normalizeValue = (value) => {
        if ('function' === typeof value) {
            return normalizeValue(value());
        } else {
            return value;
        }
    };

    /**
     * Inserts a string into another string, specified by an index.
     *
     * @param {String} input the input string
     * @param {Number} index the number of characters to insert at
     * @param {String} content the content to insert
     * @return {String} a new String which has the content inserted at the specified index
     */
    const insertAt = (input, index, content) => {
        return input.substr(0, index) + content + input.substr(index);
    };

    /**
     * Inserts content into another string, after the RegExp first match.
     *
     * @param {String} input the input string
     * @param {RegExp} regExp the RegExp instance which indicates the insertion point
     * @param {String} content the content to insert
     * @returns {String} a new String which has the content inserted after the regular expression, or the input if no match is found
     */
    const insertAfter = (input, regExp, content) => {
        const results = regExp.exec(input);
        if (!Array.isArray(results) || 0 === results.length) {
            // No match found
            return input;
        }
        const result = results;

        // Return a new string which is the first part of the match + the content + the rest of the match
        // result.index will be the index of the FIRST character of the match
        // result[0].length is the length OF the match
        return insertAt(input, result.index + result[0].length, content);
    };

    /**
     * Inserts content into another string, before the RegExp first match.
     *
     * @param {String} input the input string
     * @param {RegExp} regExp the RegExp instance which indicates the insertion point
     * @param {String} content the content to insert
     * @returns {String} a new String which has the content inserted before the regular expression, or the input if no match is found
     */
    const insertBefore = (input, regExp, content) => {
        const normalizedRegex = normalizeRegExp(regExp);
        const results = normalizedRegex.exec(input);
        if (!Array.isArray(results) || 0 === results.length) {
            // No match found
            return input;
        }
        const result = results;

        // Return a new string which is the first part of the match + the content + the rest of the match
        // result.index will be the index of the FIRST character of the match
        return insertAt(input, result.index, content);
    };

    /**
     * Replaces match(es) from a RegExp with the specified content. Multiple matches may be replaced if the RegExp
     * instance has the "global" flag set.
     *
     * @param {String} input the input string
     * @param {RegExp} regExp the RegExp instance to find a match
     * @param {String} content the content to insert
     * @returns {String} a new String which has the RegExp match(es) replaced by the content string
     */
    const replaceAt = (input, regExp, content) => {
        return input.replace(normalizeRegExp(regExp), content);
    };

    module.exports = {
        /**
         * Replaces content specified by a regular expression with specified content.
         *
         * @param {String|Function} input the input to replace
         * @param {String|RegExp|Function} regEx the regular expression (or string) to replace within the input
         * @param {String|Function} [content] the content to replace
         * @return {String} a String which has the first occurrence of the regular expression within input replaced with the content
         * @throws {String} when input or regex are not defined
         */
        replaceWith: function replaceWith(input, regex, content) {
            // Sanity check
            verifyParameterIsDefined(input, 'input', 'replaceWith');
            verifyParameterIsDefined(regex, 'regex', 'replaceWith');

            return replaceAt(normalizeValue(input), normalizeRegExp(normalizeValue(regex)), normalizeValue(content));
        },
        /**
         * Inserts content into the input string after the first occurrence of the element has been opened.
         *
         * @param {String|Function} input the input to replace
         * @param {String|Function} element the element to insert after
         * @param {String|Function} [content] the content to insert within the input string
         * @return {String} a String which has the content added after the first occurrence of the element open tag within the input string
         * @throws {String} when input or element are not defined
         */
        afterElementOpen: function afterElementOpen(input, element, content) {
            // Sanity check
            verifyParameterIsDefined(input, 'input', 'afterElementOpen');
            verifyParameterIsDefined(element, 'element', 'afterElementOpen');

            return insertAfter(normalizeValue(input), normalizeRegExp(`<${normalizeValue(element)}[^\>]*>`), normalizeValue(content));
        },
        /**
         * Inserts content into the input string before the first occurrence of the element close tag.
         *
         * @param {String|Function} input the input to replace
         * @param {String|Function} element the element to insert before close
         * @param {String|Function} content the content to replace within the input string
         * @return {String} a String which has the content added before the first occurrence of the element close tag within the input string
         * @throws {String} when input or element are not defined
         */
        beforeElementClose: function beforeElementClose(input, element, content) {
            // Sanity check
            verifyParameterIsDefined(input, 'input', beforeElementClose.name);
            verifyParameterIsDefined(element, 'element', beforeElementClose.name);

            return insertBefore(normalizeValue(input), normalizeRegExp(`<\/${normalizeValue(element)}[^\>]*>`), normalizeValue(content));
        },
        /**
         * Inserts an HTML comment into the input string after the first occurrence of the element close tag.
         *
         * @param {String|Function} input the input to replace
         * @param {String|Function} element the element to add the comment after
         * @param {String|Function} [content] the comment to add.
         * @return {String} a String which has the comment added after the first occurrence of the element close tag within the input string
         * @throws {String} when input or element are not defined
         */
        insertComment: function insertComment(input, element, comment) {
            // Sanity check
            verifyParameterIsDefined(input, 'input', insertComment.name);
            verifyParameterIsDefined(element, 'element', insertComment.name);

            return insertAfter(normalizeValue(input), normalizeRegExp(`<\/${normalizeValue(element)}[^\>]*>`), `/* ${normalizeValue(comment)} */`);
        },
        /**
         * Inserts an attribute into the input string within the first occurrence of the element open tag.
         *
         * @param {String|Function} input the input string
         * @param {String|Function} element the element tag to modify
         * @param {String|Function} attributeName the attribute name to add
         * @param {String|Function} [attributeValue] the attribute value to add
         * @return {String} a String which has the attribute added into the first occurrence of the element open tag
         * @throws {String} when input, element or attributeName are not defined
         */
        insertAttribute: function insertAttribute(input, element, attributeName, attributeValue) {
            // Sanity check
            verifyParameterIsDefined(input, 'input', insertAttribute.name);
            verifyParameterIsDefined(element, 'element', insertAttribute.name);
            verifyParameterIsDefined(attributeName, 'attributeName', insertAttribute.name);

            return insertAfter(normalizeValue(input), normalizeRegExp(`<${normalizeValue(element)}[^\>]*`), ` ${normalizeValue(attributeName)}="${normalizeValue(attributeValue)}"`);
        }
    };

})(module);

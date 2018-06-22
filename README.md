# html-amend

> Amends HTML by inserting attributes into elements, or elements into the DOM.

[![Build Status](http://img.shields.io/travis/hal313/html-amend/master.svg?style=flat-square)](https://travis-ci.org/hal313/html-amend)
[![NPM version](http://img.shields.io/npm/v/html-amend.svg?style=flat-square)](https://www.npmjs.com/package/html-amend)
[![Dependency Status](http://img.shields.io/david/hal313/html-amend.svg?style=flat-square)](https://david-dm.org/hal313/html-amend)

## Information

No HTML parsing! This is good because it is quick and easy... but also limited. Currently, only the first occurrence of an element is supported. It should be fairly trivial to add advanced locators.

<table>
<tr>
<td>Package</td><td>html-amend</td>
</tr>
<tr>
<td>Description</td>
<td>Amends HTML by inserting attributes into elements, or elements into the DOM.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 6</td>
</tr>
</table>

## Usage


#### Install

```bash
$ npm install html-amend --save-dev
```


## API
```js
  /**
   * Replaces content specified by a regular expression with specified content.
   *
   * @param {String|Function} input the input to replace
   * @param {String|RegExp|Function} regEx the regular expression (or string) to replace within the input
   * @param {String|Function} [content] the content to replace
   * @return {String} a String which has the first occurrence of the regular expression within input replaced with the content
   * @throws {String} when input or regex are not defined
   */
  function replaceWith(input, regex, content);
```

```js
  /**
   * Inserts content into the input string after the first occurrence of the element has been opened.
   *
   * @param {String|Function} input the input to replace
   * @param {String|Function} element the element to insert after
   * @param {String|Function} [content] the content to insert within the input string
   * @return {String} a String which has the content added after the first occurrence of the element open tag within the input string
   * @throws {String} when input or element are not defined
   */
  function afterElementOpen(input, element, content);
```

```js
  /**
   * Inserts content into the input string before the first occurrence of the element close tag.
   *
   * @param {String|Function} input the input to replace
   * @param {String|Function} element the element to insert before close
   * @param {String|Function} content the content to replace within the input string
   * @return {String} a String which has the content added before the first occurrence of the element close tag within the input string
   * @throws {String} when input or element are not defined
   */
  function beforeElementClose(input, element, content)
```

```js
  /**
   * Inserts an HTML comment into the input string after the first occurrence of the element close tag.
   *
   * @param {String|Function} input the input to replace
   * @param {String|Function} element the element to add the comment after
   * @param {String|Function} [content] the comment to add.
   * @return {String} a String which has the comment added after the first occurrence of the element close tag within the input string
   * @throws {String} when input or element are not defined
   */
  function insertComment(input, element, comment)
```

```js
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
  function insertAttribute(input, element, attributeName, attributeValue);
```

## Building
```
npm install
npm run build
```


### Running Tests
Tests expect to be run against an distribution, so be sure to build before running tests.

```
npm run test
```

To re-run tests during development:
```
npm run test:watch
```


## Deploying
This is a basic script which can be used to build and deploy (to NPM) the project.

```
export VERSION=<NEXT VERSION>
git checkout -b release/$VERSION
npm version --no-git-tag-version patch
npm run build
npm run test
git add package*
git commit -m 'Version bump'
npx auto-changelog -p
git add CHANGELOG.md
git commit -m 'Updated changelog'
git checkout master
git merge --no-ff release/$VERSION
git tag -a -m 'Tagged for release' $VERSION
git branch -d release/$VERSION
git checkout develop
git merge --no-ff master
git push --all && git push --tags
```

## LICENSE
[MIT License](https://raw.githubusercontent.com/hal313/html-amend/master/LICENSE)
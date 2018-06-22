/* global test:true */

(() => {
  'use strict';

  const htmlAmend = require('../src/html-amend');

  describe('html-amend', () => {

    const input = `
    <html>
      <head>
      </head>
      <body>
        <div id="first"></div><div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;


    describe('replaceWith', () => {
      const input = 'THIS IS A REPLACEME STRING';
      const content = 'REPLACED';
      const regexString = 'REPLACEME';

      test('should fail when the input is undefined', () => {
        expect(() => htmlAmend.replaceWith(undefined, regexString, content)).toThrow(`Parameter "input" must be defined for function "${htmlAmend.replaceWith.name}"`);
      });

      test('should fail when the regex is undefined', () => {
        expect(() => htmlAmend.replaceWith(input, undefined, content)).toThrow(`Parameter "regex" must be defined for function "${htmlAmend.replaceWith.name}"`);
      });

      test('should replace content with a string', () => {
        expect(htmlAmend.replaceWith(input, regexString, content)).toEqual('THIS IS A REPLACED STRING');
        expect(htmlAmend.replaceWith(() => input, () => regexString, () => content)).toEqual('THIS IS A REPLACED STRING');
      });

      test('should replace content with a string when the string regex is the wrong case', () => {
        expect(htmlAmend.replaceWith(input, regexString.toLowerCase(), content)).toEqual('THIS IS A REPLACED STRING');
        expect(htmlAmend.replaceWith(() => input, () => regexString.toLowerCase(), () => content)).toEqual('THIS IS A REPLACED STRING');
      });

      test('should replace content with a regular expression', () => {
        expect(htmlAmend.replaceWith(input, new RegExp(regexString), content)).toEqual('THIS IS A REPLACED STRING');
        expect(htmlAmend.replaceWith(() => input, () => new RegExp(regexString), () => content)).toEqual('THIS IS A REPLACED STRING');
      });

      test('should not replace content with a regular expression when the case is different', () => {
        expect(htmlAmend.replaceWith(input, new RegExp(regexString.toLowerCase()), content)).toEqual('THIS IS A REPLACEME STRING');
        expect(htmlAmend.replaceWith(() => input, () => new RegExp(regexString.toLowerCase()), () => content)).toEqual('THIS IS A REPLACEME STRING');
      });

      test('should replace content with a regular expression, ignoring case', () => {
        expect(htmlAmend.replaceWith(input, new RegExp(regexString.toLocaleLowerCase(), 'i'), content)).toEqual('THIS IS A REPLACED STRING');
        expect(htmlAmend.replaceWith(() => input, () => new RegExp(regexString.toLocaleLowerCase(), 'i'), () => content)).toEqual('THIS IS A REPLACED STRING');
      });

    });

    describe('afterElementOpen', () => {
      const content = 'someContentHere';

      ['div', 'DIV'].forEach(element => {
        test('should fail when the input is undefined', () => {
          expect(() => htmlAmend.afterElementOpen(undefined, element, content)).toThrow(`Parameter "input" must be defined for function "${htmlAmend.afterElementOpen.name}"`);
        });

        test('should fail when the element is undefined', () => {
          expect(() => htmlAmend.afterElementOpen(input, undefined, content)).toThrow(`Parameter "element" must be defined for function "${htmlAmend.afterElementOpen.name}"`);
        });

        test('should add content after the specified element opens', () => {
          const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first">${content}</div><div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;

          expect(htmlAmend.afterElementOpen(input, element, content)).toEqual(expectedHtml);
          expect(htmlAmend.afterElementOpen(() => input, () => element, () => content)).toEqual(expectedHtml);
        });

      });

      test('should not content when the element is not found', () => {
        const element = 'not-found';
        const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first"></div><div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;

        expect(htmlAmend.afterElementOpen(input, element, content)).toEqual(expectedHtml);
        expect(htmlAmend.afterElementOpen(() => input, () => element, () => content)).toEqual(expectedHtml);
      });

    });

    describe('beforeElementClose', () => {
      const content = 'someContentHere';

      ['body', 'BODY'].forEach(element => {
        test('should fail when the input is undefined', () => {
          expect(() => htmlAmend.beforeElementClose(undefined, element, content)).toThrow(`Parameter "input" must be defined for function "${htmlAmend.beforeElementClose.name}"`);
        });

        test('should fail when the element is undefined', () => {
          expect(() => htmlAmend.beforeElementClose(input, undefined, content)).toThrow(`Parameter "element" must be defined for function "${htmlAmend.beforeElementClose.name}"`);
        });

        test('should add content before the specified element closes', () => {
          const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first"></div><div id="second"></div>
        <div id="third"></div>
      ${content}</body>
    </html>`;

          expect(htmlAmend.beforeElementClose(input, element, content)).toEqual(expectedHtml);
          expect(htmlAmend.beforeElementClose(() => input, () => element, () => content)).toEqual(expectedHtml);
        });

      });

      test('should not add content when the element is not found', () => {
        const element = 'not-found';
        const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first"></div><div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;

        expect(htmlAmend.beforeElementClose(input, element, content)).toEqual(expectedHtml);
        expect(htmlAmend.beforeElementClose(() => input, () => element, () => content)).toEqual(expectedHtml);
      });

    });

    describe('insertComment', () => {
      const comment = 'This is a comment';

      ['div', 'DIV'].forEach(element => {
        test('should fail when the input is undefined', () => {
          expect(() => htmlAmend.insertComment(undefined, element, comment)).toThrow(`Parameter "input" must be defined for function "${htmlAmend.insertComment.name}"`);
        });

        test('should fail when the element is undefined', () => {
          expect(() => htmlAmend.insertComment(input, undefined, comment)).toThrow(`Parameter "element" must be defined for function "${htmlAmend.insertComment.name}"`);
        });

        test('should add a comment after the specified element closes', () => {
          const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first"></div>/* ${comment} */<div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;

          expect(htmlAmend.insertComment(input, element, comment)).toEqual(expectedHtml);
          expect(htmlAmend.insertComment(() => input, () => element, () => comment)).toEqual(expectedHtml);
        });

      });

    });

    describe('insertAttribute', () => {
      const attributeName = 'style';
      const attributeValue = 'display: none;';

      ['div', 'DIV'].forEach(element => {
        test('should fail when the input is undefined', () => {
          expect(() => htmlAmend.insertAttribute(undefined, element, attributeName, attributeValue)).toThrow(`Parameter "input" must be defined for function "${htmlAmend.insertAttribute.name}"`);
        });

        test('should fail when the element is undefined', () => {
          expect(() => htmlAmend.insertAttribute(input, undefined, attributeName, attributeValue)).toThrow(`Parameter "element" must be defined for function "${htmlAmend.insertAttribute.name}"`);
        });

        test('should fail when the attribute name is undefined', () => {
          expect(() => htmlAmend.insertAttribute(input, element, undefined, attributeValue)).toThrow(`Parameter "attributeName" must be defined for function "${htmlAmend.insertAttribute.name}"`);
        });

        test('should add an attribute in the specified element', () => {
          const expectedHtml = `
    <html>
      <head>
      </head>
      <body>
        <div id="first" ${attributeName}="${attributeValue}"></div><div id="second"></div>
        <div id="third"></div>
      </body>
    </html>`;

          expect(htmlAmend.insertAttribute(input, element, attributeName, attributeValue)).toEqual(expectedHtml);
          expect(htmlAmend.insertAttribute(() => input, () => element, () => attributeName, () => attributeValue)).toEqual(expectedHtml);
        });

      });

    });

  });
})();
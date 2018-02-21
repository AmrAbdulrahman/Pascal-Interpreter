import CodeMirror from 'codemirror';
import { RESERVED_KEYWORDS as keywords } from '../../Interpreter/Lexer';

CodeMirror.defineMode('simple-code', (config, parserConfig) => {
  return {
    startState() {
      return {
        inBlockComment: false,
        lastID: null,
        procedures: [],
      };
    },
    token(stream, state) {
      // inside block comment, either
      // 1) ends on the current line or
      // 2) skip the current line
      if (state.inBlockComment) {
        if (stream.skipTo('*/') ) { // ends on the current line
          stream.eat('*');
          stream.eat('/');
          state.inBlockComment = false;
        } else {
          stream.skipToEnd();
        }

        return 'comment';
      }

      // start block comment
      if (stream.match('/*')) {
        state.inBlockComment = true;
        return 'comment';
      }

      // line comment
      if (stream.match('//')) {
        stream.skipToEnd();
        return 'comment';
      }

      // single quoted string string
      if (stream.match(`'`)) {
        stream.skipTo(`'`);
        return 'string';
      }

      // double quoted string string
      if (stream.match(`"`)) {
        stream.skipTo(`"`);
        return 'string';
      }

      // number, keyword/operator, variable/function
      let id = '';
      while (stream.match(/\w/i, false)) {
        id += stream.next();
      }

      if (id) {
        const lastID = state.lastID || '';
        state.lastID = id;

        if (/^[\d]*$/.test(id)) {
          return 'number';
        }

        if (/^(less|greater|than|or|equals|equal)$/i.test(id)) {
          return 'operator';
        }

        if (id === 'create') {
          return 'create-keyword';
        }

        if (id === 'procedure') {
          return 'procedure-keyword';
        }

        const keywordsRegExp = new RegExp(`^(${keywords.join('|')})$`, 'i');
        if (keywordsRegExp.test(id)) {
          return 'keyword';
        }

        if (lastID.toLowerCase() === 'procedure') {
          state.procedures.push(id.toLowerCase()); // register procedure
          return 'procedure';
        }

        if (state.procedures.indexOf(id.toLowerCase()) !== -1) {
          return 'procedure';
        }

        if (id.toLowerCase() === 'print') {
          return 'procedure';
        }

        return 'variable';
      }

      stream.next();
    }
  }
});

# rxjs-repeater

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/rxjs-repeater.svg?style=flat-square)](https://npmjs.org/package/rxjs-repeater)
[![Build Status](https://img.shields.io/travis/gogopg/rxjs-repeater/master.svg?style=flat-square)](https://travis-ci.org/gogopg/rxjs-repeater) [![Coverage Status](https://img.shields.io/codecov/c/github/gogopg/rxjs-repeater/master.svg?style=flat-square)](https://codecov.io/gh/gogopg/rxjs-repeater/branch/master)

Utility for continuously repeating the observables of rxjs

## Install

    $ npm install --save rxjs-repeater

## Usage

```js
import Repeater from "rxjs-repeater";

const targetObservable = ...
const repeater = new Repeater(targetObservable);
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

## License

MIT © [wonjoon](https://github.com/gogopg)

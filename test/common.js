/*!
 * Mocha setup
 * @author Andrew Teologov <teologov.and@gmail.com>
 * @date 12/20/15
 */

"use strict";

let mocha = require("mocha"),
    coMocha = require("co-mocha");

global.sinon = require("sinon");
global.chai = require("chai");
global.expect = global.chai.expect;
global.assert = global.chai.assert;

coMocha(mocha);
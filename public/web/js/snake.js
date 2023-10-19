/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/snake/game.ts":
/*!***************************!*\
  !*** ./src/snake/game.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Game {\n    constructor(_snake) {\n        this._snake = _snake;\n        this.nextFrame = this._gameLoop.bind(this);\n    }\n    start() {\n        this._loadAssets().then(() => {\n            window.addEventListener(\"keydown\", (event) => {\n                switch (event.key.toLowerCase()) {\n                    case \"w\":\n                        this._snake.setDirection(0, -1);\n                        break;\n                    case \"a\":\n                        this._snake.setDirection(-1, 0);\n                        break;\n                    case \"s\":\n                        this._snake.setDirection(0, 1);\n                        break;\n                    case \"d\":\n                        this._snake.setDirection(1, 0);\n                        break;\n                }\n            });\n            window.addEventListener(\"keyup\", (event) => {\n            });\n            window.addEventListener(\"resize\", () => {\n            });\n            requestAnimationFrame(this.nextFrame);\n        });\n    }\n    _gameLoop() {\n        this._snake.update();\n        requestAnimationFrame(this.nextFrame);\n    }\n    _loadAssets() {\n        return __awaiter(this, void 0, void 0, function* () {\n        });\n    }\n}\nexports[\"default\"] = Game;\n\n\n//# sourceURL=webpack://Joey's_Games_Web/./src/snake/game.ts?");

/***/ }),

/***/ "./src/snake/main.ts":
/*!***************************!*\
  !*** ./src/snake/main.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar _a;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_1 = __importDefault(__webpack_require__(/*! ./game */ \"./src/snake/game.ts\"));\nconst snake_1 = __importDefault(__webpack_require__(/*! ./snake */ \"./src/snake/snake.ts\"));\nconst canvas = document.createElement(\"canvas\");\nconst context = canvas.getContext(\"2d\", { alpha: false });\nif (!context) {\n    throw new Error(\"2d context is not supported by browser\");\n}\n(_a = document.getElementById(\"canvas-container\")) === null || _a === void 0 ? void 0 : _a.appendChild(canvas);\nconst unitLength = 16;\nconst snake = new snake_1.default(context, unitLength);\nconst game = new game_1.default(context, snake);\ngame.start();\n\n\n//# sourceURL=webpack://Joey's_Games_Web/./src/snake/main.ts?");

/***/ }),

/***/ "./src/snake/snake.ts":
/*!****************************!*\
  !*** ./src/snake/snake.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Snake {\n    constructor(_ctx, _unitLength) {\n        this._ctx = _ctx;\n        this._unitLength = _unitLength;\n        this.isDead = false;\n        this._dx = 1;\n        this._dy = 0;\n        this._positions_x = [5, 4, 3];\n        this._positions_y = [10, 10, 10];\n        this._size = 3;\n    }\n    update() {\n        this._positions_x.unshift(this._positions_x[0] + this._dx);\n        this._positions_y.unshift(this._positions_y[0] + this._dy);\n        this._positions_x.pop();\n        this._positions_y.pop();\n        this._ctx.fillStyle = \"black\";\n        for (let i = 0; i < this._size; i++) {\n            this._ctx.fillRect(this._positions_x[i], this._positions_y[i], this._unitLength, this._unitLength);\n        }\n    }\n    setDirection(dx, dy) {\n        this._dx = dx;\n        this._dy = dy;\n    }\n    grow() {\n        this._positions_x.push(2 * this._positions_x[this._size - 1] - this._positions_x[this._size - 2]);\n        this._positions_y.push(2 * this._positions_y[this._size - 1] - this._positions_y[this._size - 2]);\n        this._size++;\n    }\n    checkCollide() {\n        for (let i = 1; i < this._size; i++) {\n            if (this._positions_x[0] === this._positions_x[i] && this._positions_y[0] === this._positions_y[i]) {\n                return true;\n            }\n        }\n        return this._positions_x[0] === 0 || this._positions_x[0] === this._size - 1 || this._positions_y[0] === 0 || this._positions_y[0] === this._size - 1;\n    }\n}\nexports[\"default\"] = Snake;\n\n\n//# sourceURL=webpack://Joey's_Games_Web/./src/snake/snake.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/snake/main.ts");
/******/ 	
/******/ })()
;
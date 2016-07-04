"use strict";

// const React = require('react');
// const blarg = require('react-dom');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

console.log(">", _react2.default);

var TodoItem = function (_React$Component) {
  _inherits(TodoItem, _React$Component);

  function TodoItem() {
    _classCallCheck(this, TodoItem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoItem).apply(this, arguments));
  }

  _createClass(TodoItem, [{
    key: "render",
    value: function render() {
      var props = this.props;
      return React.createElement("div", { className: "todo-item" }, React.createElement("input", { type: "checkbox" }), React.createElement("div", { className: "label" }, props.label), React.createElement("button", { className: "delete-btn" }, "×"));
    }
  }]);

  return TodoItem;
}(React.Component);

var AddTodo = function AddTodo(props) {
  return React.createElement("div", { className: "add-todo" }, React.createElement("input", { type: "text", placeholder: props.placeholder }));
};

var TodoApp = function TodoApp(props) {
  return React.createElement("div", { className: "todo-app" }, React.createElement(AddTodo, { placeholder: "What to do?" }), React.createElement(TodoItem, { label: "Work on codetest" }), React.createElement(TodoItem, { label: "Grade quizzes" }), React.createElement(TodoItem, { label: "Unpack from vacation" }));
};

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById('output'));
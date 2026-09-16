const React = require('./react.cjs');
exports.Fragment = React.Fragment;
exports.jsx = exports.jsxs = function(type, props, key) {
  return React.createElement(type, key === undefined ? props : {...props, key});
};

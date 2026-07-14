// Only used by Jest to transpile the handful of ESM-only transitive
// dependencies (@noble/hashes, @noble/ed25519) that @stellar/stellar-sdk
// pulls in — application/library code is compiled by tsc, not Babel.
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};

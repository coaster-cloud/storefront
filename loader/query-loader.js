module.exports = function (source, map) {
  this.callback(
    null,
    `export default function (Component) {
      Component.options.__query = (${
        JSON.stringify(source)
      }).trim();
    }`,
    map
  )
}

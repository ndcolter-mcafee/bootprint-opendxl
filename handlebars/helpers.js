var Handlebars = require('handlebars')


module.exports = {
  'opendxl--normalize-service-request': function (topic, options) {
    return topic.replace('#/requests/', '').replace(/~1/g, '/')
  },
  'opendxl--normalize-solution-event': function (topic, options) {
    return topic.replace('#/events/', '').replace(/~1/g, '/')
  },
  'opendxl--normalize-solution-service': function (topic, options) {
    return topic.replace('#/services/', '').replace(/~1/g, '/')
  },
  'eachSortedRef': function (context, options) {
    if (typeof context !== 'object') {
      return ret
    }
    var m = {}
    context.forEach(function(el) {
      m[el.$ref] = el
    })
    context = m
    var ret = ''
    var data
    var keys = Object.keys(context)
    keys.sort(function (a, b) {
      // http://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
      a = String(a).toLowerCase()
      b = String(b).toLowerCase()
      if (a === b) return 0
      if (a > b) return 1
      return -1
    }).forEach(function (key, index) {
      if (options.data) {
        data = Handlebars.createFrame(options.data || {})
        data.index = index
        data.key = key
        data.length = keys.length
        data.first = index === 0
        data.last = index === keys.length - 1
      }
      ret = ret + options.fn(context[key], {data: data})
    })
    return ret
  }
}

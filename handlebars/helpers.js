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
  'opendxl-json-schema--resolve-ref': function (reference, options) {
      return opendxlResolveRef(reference, options)
  },
  'opendxl-is-incoming': function (reference, options) {
    return opendxlResolveRef(reference, options).isIncoming
  },
  'opendxl-has-incoming': function (events, options) {
    return opendxlHasIncomingOrOutgoingEvents(true, events, options)
  },
  'opendxl-has-outgoing': function (events, options) {
    return opendxlHasIncomingOrOutgoingEvents(false, events, options)
  },
  'eachSortedRef': function (context, options) {
      if (typeof context !== 'object') {
          return ret
      }
      var m = {}
      context.forEach(function (el) {
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
}}

function opendxlHasIncomingOrOutgoingEvents(isIncoming, events, options) {
    for (var idx in events) {
        var ref = events[idx]['$ref']
        var event = opendxlResolveRef(ref, options)
        if (isIncoming ? event.isIncoming : !event.isIncoming) {
            return true
        }
    }
    return false
}

function opendxlResolveRef (reference, options) {
    if (reference.lastIndexOf('#', 0) < 0) {
        console.warn('Remote references not supported yet. Reference must start with "#" (but was ' + reference + ')')
        return {}
    }
    var components = reference.split('#')
    var hash = components[1]
    var hashParts = hash.split('/')
    var current = options.data.root
    hashParts.forEach(function (hashPart) {
        hashPart = hashPart.replace(/~1/g, '/')
        if (hashPart.trim().length > 0) {
            if (typeof current === 'undefined') {
                throw new Error("Reference '" + reference + "' cannot be resolved. '" + hashPart + "' is undefined.")
            }
            current = current[hashPart]
        }
    })
    return current
}

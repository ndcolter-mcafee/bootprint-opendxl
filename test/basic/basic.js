var path = require('path')

function generate(name, out) {
  var p = path.join(__dirname, "../../examples/" + name)
  var targetDir = path.join('test-output', path.basename(name))
  return require('bootprint')
    .load(require('../../'))
    .merge({/* Any other configuration */})
    .build(p, targetDir)
    .generate()
}

describe('Basic test', function () {
  this.timeout(30000)

  it('Generate output for acme.jsom', function () {
    return generate('acme.json')
  })
  it('Generate output for acme.yaml', function () {
    return generate('acme.yaml')
  })
})

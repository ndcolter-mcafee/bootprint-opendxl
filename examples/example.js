var path = require('path');

var schemas = {
  "acme.json": "acme_json_out",
  "dxlbroker.json": "dxlbroker_json_out",
  "acme.yaml": "acme_yaml_out",
  "dxlbroker.yaml": "dxlbroker_yaml_out"
};

for (var name in schemas) {
  require('bootprint')
    .load(require('../'))
    .merge({/* Any other configuration */})
    .build(path.join(__dirname, name), "target/" + schemas[name])
    .generate()
    .done(console.log);
}


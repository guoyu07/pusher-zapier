var expect = require('expect.js');

// Zapier provides a number of libraries via the `z` global.
// Stub out here for testing purposes.
var z = {
  hmac: function() {},
  hash: function() {}
};

// Zapier also provides makes underscore `_` available as a global.
// Stub out here for testing purposes.
var _ = {
  each: function() {}
};

var Zap = require(__dirname + '/../dist/pusher-zapier.js');

describe('Zap', function(){
  
  beforeEach(function() {
    global.z = z;
    global._ = _;
  });
  
  it('should be defined', function() {
    expect(Zap).to.be.ok();
  });
  
  it('should have a trigger_pre_write function', function() {
    var easy = "subject|things"
    expect(Zap.trigger_pre_write).to.be.a('function');
  });
  
  it('should default to using the "api" cluster', function() {
    var sampleBundle = require(__dirname + '/samplebundle.json');
    
    var result = Zap.trigger_pre_write(sampleBundle);
    expect(result.url).to.contain('api.pusherapp.com');
  });
  
  it('should set the domain to pusher.com if a cluster is supplied', function() {
    var sampleBundle = require(__dirname + '/samplebundle.json');
    
    sampleBundle.auth_fields.cluster = 'useast1';
    
    var result = Zap.trigger_pre_write(sampleBundle);
    expect(result.url).to.contain('api-useast1.pusher.com');
  });
  
});

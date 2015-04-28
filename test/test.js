var expect = require('expect.js');

var Zap = require(__dirname + '/../dist/pusher-zapier.js');

describe('Zap', function(){
  
  it('should be defined', function() {
    expect(Zap).to.be.ok();
  });
  
  it('should have a trigger_pre_write function', function() {
    var easy = "subject|things"
    expect(Zap.trigger_pre_write).to.be.a('function');
  });
  
});

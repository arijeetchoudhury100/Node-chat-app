var expect = require('expect');
var {generateMessage} = require('./message.js');
var {generateLocationMessage} = require('./message.js');

describe('generateMessage',()=>{
  it('should generate correct message object',()=>{
    var from = 'jen';
    var text = 'some message';
    var message = generateMessage(from,text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from,
      text
    });
  });
});
describe('generateLocationMessage',()=>{
  it('should generate correct location',()=>{
      var from = 'dev'
      var latitude = 15
      var longitude = 19
      var url = 'https://www.google.com/maps?q=15,19';
      var message = generateLocationMessage(from, latitude, longitude);
      expect(message.createdAt).toBeA('number');
      expect(message).toInclude({
        from,
        url
      });
  });
});

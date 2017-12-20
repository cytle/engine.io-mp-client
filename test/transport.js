
var expect = require('expect.js');
var eio = require('../');

// Disables eslint to capitalise constructor names
/* eslint-disable new-cap */

describe('Transport', function () {
  describe('rememberUpgrade', function () {
    it('should remember websocket connection', function (done) {
      var socket = new eio.Socket();
      // expect(socket.transport.name).to.be('polling');

      var timedout = false;
      var timeout = setTimeout(function () {
        timedout = true;
        socket.close();
        done();
      }, 300);

      socket.on('upgrade', function (transport) {
        if (timedout) return;
        clearTimeout(timeout);
        socket.close();
        if (transport.name === 'websocket') {
          var socket2 = new eio.Socket({ 'rememberUpgrade': true });
          expect(socket2.transport.name).to.be('websocket');
        }
        done();
      });
    });

    it('should not remember websocket connection', function (done) {
      var socket = new eio.Socket();
      // expect(socket.transport.name).to.be('polling');

      var timedout = false;
      var timeout = setTimeout(function () {
        timedout = true;
        socket.close();
        done();
      }, 300);

      socket.on('upgrade', function (transport) {
        if (timedout) return;
        clearTimeout(timeout);
        socket.close();
        if (transport.name === 'websocket') {
          var socket2 = new eio.Socket({ 'rememberUpgrade': false });
          expect(socket2.transport.name).to.not.be('websocket');
        }
        done();
      });
    });
  });

  describe('public constructors', function () {
    it('should include Transport', function () {
      expect(eio.Transport).to.be.a('function');
    });

    it('should include WebSocket', function () {
      expect(eio.transports).to.be.an('object');
      expect(eio.transports.websocket).to.be.a('function');
    });
  });

  describe('transport uris', function () {
    it('should generate a ws uri', function () {
      var ws = new eio.transports.websocket({
        path: '/engine.io',
        hostname: 'test',
        secure: false,
        query: { transport: 'websocket' },
        timestampRequests: false
      });
      expect(ws.uri()).to.be('ws://test/engine.io?transport=websocket');
    });

    it('should generate a wss uri', function () {
      var ws = new eio.transports.websocket({
        path: '/engine.io',
        hostname: 'test',
        secure: true,
        query: {},
        timestampRequests: false
      });
      expect(ws.uri()).to.be('wss://test/engine.io');
    });

    it('should timestamp ws uris', function () {
      var ws = new eio.transports.websocket({
        path: '/engine.io',
        hostname: 'localhost',
        timestampParam: 'woot',
        timestampRequests: true
      });
      expect(ws.uri()).to.match(/ws:\/\/localhost\/engine\.io\?woot=[0-9A-Za-z-_]+/);
    });

    it('should generate a ws ipv6 uri', function () {
      var ws = new eio.transports.websocket({
        path: '/engine.io',
        hostname: '::1',
        secure: false,
        port: 80,
        timestampRequests: false
      });
      expect(ws.uri()).to.be('ws://[::1]/engine.io');
    });

    it('should generate a ws ipv6 uri with port', function () {
      var ws = new eio.transports.websocket({
        path: '/engine.io',
        hostname: '::1',
        secure: false,
        port: 8080,
        timestampRequests: false
      });
      expect(ws.uri()).to.be('ws://[::1]:8080/engine.io');
    });
  });
});

const assert = require("assert");
const sinon = require("sinon");
const PubSub = require("./../");

describe("PubSub", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new PubSub();
      callback = sinon.spy();
   });

   it("has a singleton method that works", () => {
      assert(PubSub.singleton() === PubSub.singleton());
   });

   it("executes all and only the registered callbacks of an event when that event gets published", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 2);
      assert.equal(callback.getCall(0).args[0], "event_1");
      assert.equal(callback.getCall(0).args[1], 42);
      assert.equal(callback.getCall(1).args[0], "event_1");
      assert.equal(callback.getCall(1).args[1], 42);
   });

   it("allows registering the same callback to multiple events", () => {
      ps.subscribe(["event_1", "event_2"], callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 2);
   });

   it("executes all and only the registered `once` callbacks of an event when that event gets published", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback);
      ps.once("event_2", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 2);
      assert.equal(callback.getCall(0).args[0], "event_1");
      assert.equal(callback.getCall(0).args[1], 42);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 2);
   });

   it("allows registering the same `once` callback to multiple events", () => {
      ps.once(["event_1", "event_2"], callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 2);
   });

   it("executes `once` callbacks only one time", () => {
      ps.once("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
   });

   it("unregisters a callback from a particular event when asked to", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("unregisters a `once` callback from a particular event when asked to", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback);
      ps.once("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("can flush all callbacks associated to an event", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      assert.equal(ps._subscribers.size, 2);

      ps.flush("event_1");

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(ps._subscribers.size, 1);
   });
});

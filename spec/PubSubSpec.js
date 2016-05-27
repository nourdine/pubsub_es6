const assert = require("assert");
const PubSub = require("./../PubSub");

describe("PubSub", () => {

   var ps;
   var n = 0;
   var cb = () => {
      n++;
   };

   beforeEach(() => {
      ps = new PubSub();
      n = 0;
   });

   it("has a singleton method that works", () => {
      assert(PubSub.singleton() === PubSub.singleton());
   });

   it("executes all and only the registered callbacks of a channel when that channel gets published", () => {
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      ps.publish("ch_1");
      assert.equal(n, 2);
   });
   
   it("executes all and only the registered once callbacks of a channel when that channel gets published", () => {
      ps.once("ch_1", cb);
      ps.once("ch_1", cb);
      ps.once("ch_2", cb);
      ps.publish("ch_1");
      assert.equal(n, 2);
   });
   
   it("executes once callbacks only one time", () => {
      ps.once("ch_1", cb);
      ps.publish("ch_1");
      assert.equal(n, 1);
      ps.publish("ch_1");
      assert.equal(n, 1);   
   });
   
   it("unregisters a callback from a particular channel when asked to", () => {
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      ps.unsubscribe("ch_1", cb);
      ps.publish("ch_1");
      assert.equal(n, 0);
      ps.publish("ch_2");
      assert.equal(n, 1);
   });
   
   it("unregisters a once callback from a particular channel when asked to", () => {
      ps.once("ch_1", cb);
      ps.once("ch_1", cb);
      ps.once("ch_2", cb);
      ps.unsubscribe("ch_1", cb);
      ps.publish("ch_1");
      assert.equal(n, 0);
      ps.publish("ch_2");
      assert.equal(n, 1);
   });
   
   it("can purge a channel", () => {
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      assert.equal(ps._subscribers.size, 2);
      ps.purge("ch_1");
      ps.publish("ch_1");
      assert.equal(n, 0);
      ps.publish("ch_2");
      assert.equal(n, 1);
      assert.equal(ps._subscribers.size, 1);
   });
});

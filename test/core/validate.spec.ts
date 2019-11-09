import { Rule, Validate } from "@/core/validate";

describe("validate class", () => {
  beforeEach(() => {});
  it("test1", function() {
    const validate = new Validate();
    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });
    const maxLen = validate.get("maxLen");
    let result = maxLen({ maxLen: 10 })
      .message("i am message")
      .validate(11);
    console.log(result);
  });
  it("test2", function() {
    const validate = new Validate();
    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });
    validate.config.rawResult = true;
    const maxLen = validate.get("maxLen");

    let result = maxLen({ maxLen: 10 })
      .message("i am message")
      .validate({ value1: 11, value2: 8 }, true);
    console.log(result);
  });
  it("test3", function() {
    const validate = new Validate();

    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });
    validate.register("minLen", function(value: any, rule: any) {
      if (value >= rule.minLen) {
        return true;
      }
      return false;
    });
    const rules = [
      { name: "maxLen", maxLen: 10, message: "i am maxLen message" },
      { name: "minLen", minLen: 2, message: "i am minLen message" }
    ];

    let result = validate.setRules(rules).validate(11);
    let result2 = validate.setRules(rules).validate(8);
    console.log(result);
  });
  it("test4", function() {
    const validate = new Validate();

    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });
    validate.register("minLen", function(value: any, rule: any) {
      if (value >= rule.minLen) {
        return true;
      }
      return false;
    });
    const rules = [
      { name: "maxLen", maxLen: 10, message: "i am maxLen message" },
      { name: "minLen", minLen: 2, message: "i am minLen message" }
    ];

    let result = validate
      .setRules(rules)
      .validate({ value1: 11, value2: 8 }, true);
  });
  it("test5", function() {
    const validate = new Validate();

    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });
    validate.register("minLen", function(value: any, rule: any) {
      if (value >= rule.minLen) {
        return true;
      }
      return false;
    });
    const keyOptions = {
      key1: { name: "maxLen", maxLen: 10, message: "i am key1 maxLen message" },
      key2: [
        { name: "maxLen", maxLen: 10, message: "i am key1 maxLen message" },
        { name: "minLen", minLen: 2, message: "i am key1 minLen message" }
      ]
    };
    const keyValues = {
      key1: 10,
      key2: 8
    };
    let result = validate.setKeyRules(keyOptions).validate(keyValues);
    console.log(result);
    // expect(result.key1.message).toEqual("i am key1 maxLen message");
    // expect(result.key2.maxLen.message).toEqual("i am key1 maxLen message");
  });
});

export interface MinLenRule extends Rule{
    minLen: number
}

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
    expect(result.status).toEqual(false);
    expect(result.message).toEqual("i am message");
  });
  it("test2", function() {
    const validate = new Validate();
    validate.register("maxLen", function(value: any, rule: any) {
      if (value <= rule.maxLen) return true;
      return false;
    });

    const maxLen = validate.get("maxLen");

    let result = maxLen({ maxLen: 10 })
      .message("i am message")
      .validate({ value1: 11, value2: 8 }, true);
    expect(result.value1.status).toEqual(false);
    expect(result.value2.status).toEqual(true);
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

    let result = validate.setRules(rules).validate(8);
    expect(result.maxLen.status).toEqual(true);
    expect(result.maxLen.message).toEqual("i am maxLen message");
    expect(result.minLen.status).toEqual(true);
    expect(result.minLen.message).toEqual("i am minLen message");
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
    expect(result.value1.maxLen.status).toEqual(false);
    expect(result.value1.minLen.status).toEqual(true);
    expect(result.value1.maxLen.message).toEqual("i am maxLen message");
    expect(result.value1.minLen.message).toEqual("i am minLen message");
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
    expect(result.key1.message).toEqual("i am key1 maxLen message");
    expect(result.key2.maxLen.message).toEqual("i am key1 maxLen message");
  });
});

export interface MinLenRule extends Rule{
    minLen: number
}

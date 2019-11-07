export interface AbstractRule {
  name?: string;
  message?: string;
}
export interface Rule extends AbstractRule {
  name: string;
}
export interface KeyRules {
  [key: string]: Rule | Array<Rule>;
}

export interface ValidateConfig {
  noMessage?: boolean;
}

export class Validate {
  private config: ValidateConfig = { noMessage: false };
  constructor() {}
  register(name: string, ruleResolve: Function) {
    (this as { [key: string]: any })[name] = this.registerFatory(
      name,
      ruleResolve
    );
  }

  get(name: string) {
    return (this as { [key: string]: any })[name];
  }
  validateRulesHandle(ruleOrRules: Array<Rule> | Rule, value: any) {
    let result: { [key: string]: any };
    if (ruleOrRules instanceof Array) {
      result = {};
      ruleOrRules.forEach(rule => {
        const validateName = rule.name;
        result[validateName] = (this as { [key: string]: any })
          [validateName](rule)
          .validate(value);
      });
    } else {
      const rule = ruleOrRules;
      const validateName = rule.name;
      result = (this as { [key: string]: any })
        [validateName](rule)
        .validate(value);
    }
    return result;
  }

  validateaValuesHandle(
    ruleOrRules: Array<Rule> | Rule,
    values: any,
    isMulti?: boolean
  ) {
    let result: any;
    if (isMulti) {
      result = {} as { [key: string]: any };
      let keys = Object.keys(values);
      keys.forEach(key => {
        let value = values[key];
        result[key] = this.validateRulesHandle(ruleOrRules, value);
      });
    } else {
      result = this.validateRulesHandle(ruleOrRules, values);
    }
    return result;
  }

  setRules(rules: Array<Rule> | Rule) {
    const self = this;
    return {
      validate: function(values: any, isMulti?: boolean) {
        return self.validateaValuesHandle(rules, values, isMulti);
      }
    };
  }
  setKeyRules(KeyRules: KeyRules) {
    const self = this;
    let keys = Object.keys(KeyRules);
    return {
      validate: function(values: any) {
        let result = {} as { [key: string]: any };
        keys.forEach(key => {
          let rules = KeyRules[key];
          const value = values[key];
          if (!value) {
            console.error(`not found option.key: ${key}  at validate(values)`);
          }
          result[key] = self.validateRulesHandle(rules, values);
        });
        (result as { [key: string]: any })["get"] = function(key: string) {
          return result[key];
        };
        return result;
      }
    };
  }
  validateFatory(
    validateName: string,
    rule: AbstractRule | Rule | {[key: string]: any},
    ruleResolve: Function
  ) {
    const self = this;
    return function(values: any, isMulti: boolean) {
      if (!self.config.noMessage) {
        if (!rule.message) {
          console.error(`message undefined,you can defined by message() or options:{
                        message: 'i am message'
                        } `);
        }
      }

      let result: any;
      if (isMulti) {
        result = {} as { [key: string]: any };
        const keys = Object.keys(values);
        keys.forEach(key => {
          const value = values[key];
          result[key] = {
            name: validateName,
            value: value,
            status: ruleResolve(value, rule),
            message: rule.message
          };
          if (!self.config.noMessage) result[key].message = rule.message;
        });
      } else {
        result = {
          name: validateName,
          value: values,
          status: ruleResolve(values, rule)
        };
        if (!self.config.noMessage) result.message = rule.message;
      }
      return result;
    };
  }

  registerFatory(validateName: string, ruleResolve: Function) {
    const self = this;
    if (ruleResolve instanceof Function) {
      return function(rules: AbstractRule | Rule | {[key: string]: any}) {
        //定义validate()

        let validate = self.validateFatory(validateName, rules, ruleResolve);
        //定义message()
        let messageFunc = function(message: string) {
          rules.message = message;
          return { validate: validate };
        };

        return {
          rules: rules,
          ruleResolve: ruleResolve,
          validate: validate,
          message: messageFunc
        };
      };
    }
  }
}


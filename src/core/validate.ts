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
  rawResult?: boolean;
}

export class Validate {
  config: ValidateConfig = { noMessage: false, rawResult: false };
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

  setRules(rules: Array<Rule> | Rule) {
    const self = this;
    return {
      validate: function(values: any, isMulti?: boolean) {
        return self.dispatcher("setRules", values, {
          rules: rules,
          isMulti: isMulti
        });
      }
    };
  }
  setKeyRules(keyRules: KeyRules) {
    const self = this;
    return {
      validate: function(values: any) {
        return self.dispatcher("setKeyRules", values, { keyRules: keyRules });
      }
    };
  }
  validateRulesHandle(ruleOrRules: Array<Rule> | Rule, value: any) {
    let result: any;
    if (ruleOrRules instanceof Array) {
      for (let i = 0; i < ruleOrRules.length; i++) {
        const rule = ruleOrRules[i];
        const validateName = rule.name;
        const temp = (this as { [key: string]: any })
          [validateName](rule)
          .validate(value);
        if (!this.config.rawResult) {
          if (temp.hasError) {
            result = temp;
            break;
          }
        } else {
          (result as { [key: string]: any })[validateName] = temp;
        }
      }
    } else {
      const rule = ruleOrRules;
      const validateName = rule.name;
      result = (this as { [key: string]: any })
        [validateName](rule)
        .validate(value);
    }
    return result;
  }

  validateValuesHandle(
    ruleOrRules: Array<Rule> | Rule,
    values: any,
    isMulti?: boolean
  ) {
    let result: any;
    if (isMulti) {
      let keys = Object.keys(values);
      if (keys.length > 0) {
        result = {} as { [key: string]: any };
      }
      keys.forEach(key => {
        let value = values[key];

        if (value) {
          const temp = this.validateRulesHandle(ruleOrRules, value);
          if (temp) {
            result[key] = temp;
          } else {
            result[key] = {};
          }
        } else {
          result[key] = {};
        }
      });
    } else {
      result = this.validateRulesHandle(ruleOrRules, values);
    }
    return result;
  }
  dispatcher(type: string, values: any, options: any) {
    let result: any;
    if (type === "setKeyRules") {
      const keyRules = options.keyRules;
      const keys = Object.keys(keyRules);
      if (keys.length > 0) {
        result = {} as { [key: string]: any };
      }

      keys.forEach(key => {
        let rules = keyRules[key];
        const value = values[key];
        if (!value) {
          console.error(`not found option.key: ${key}  at validate(values)`);
        }
        (result as { [key: string]: any })[key] = this.validateRulesHandle(
          rules,
          values
        );
      });
    } else if (type === "setRules") {
      const rules = options.rules;
      const isMulti = options.isMulti;
      result = this.validateValuesHandle(rules, values, isMulti);
    }

    return result;
  }
  validateFatory(
    validateName: string,
    rule: AbstractRule | Rule | { [key: string]: any },
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
        const keys = Object.keys(values);

        if (keys.length > 0) {
          result = {};
        }
        keys.forEach(key => {
          let value;
          if (values[key]) {
            value = values[key];
          }

          (result as { [key: string]: any })[key] = {
            name: validateName,
            hasError: !ruleResolve(value, rule),
            rule: rule,
            value: value,
            ruleResolve: ruleResolve
          };
          if (!self.config.noMessage)
            (result as { [key: string]: any })[key].message = rule.message;
        });
      } else {
        result = {
          name: validateName,
          hasError: !ruleResolve(values, rule),
          rule: rule,
          value: values,
          ruleResolve: ruleResolve
        };
        if (!self.config.noMessage) result.message = rule.message;
      }

      return result;
    };
  }

  registerFatory(validateName: string, ruleResolve: Function) {
    const self = this;
    if (ruleResolve instanceof Function) {
      return function(rules: AbstractRule | Rule | { [key: string]: any }) {
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


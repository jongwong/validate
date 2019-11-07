# Validate

## Demo
`var validate = new Validate();`

`validate.register('maxLen', function (value,rule) {`

   `if(value <= rule.maxLen) {`
   
      `return  true`
      
   `}`
   
   `return false`
   
`});`

`validate.register('minLen', function (value,rule) {`

   `if(value >= rule.minLen) {`

      `return  true`

   `}`

   `return false`

`});`



`var rules = [`

   `{name: 'maxLen',maxLen: 10,message: 'i am maxLen message'},`

   `{name: 'minLen',minLen: 2,message: 'i am test2 message'}];`

`var result1 = validate.minLen({maxLen: 10}).message('i am message').validate(10);`

`var result2 = validate.minLen({maxLen: 10}).message('i am message').validate({value1: 10,value2: 8}, true);`

`var result3 = validate.setRules(rules).validate(8);`

`var result4 = validate.setRules(rules).validate({value1: 10,value2: 8}, true);`



`var keyOptions = {`

   `key1: {name: 'maxLen',rule: {maxLen: 10,message: 'i am maxLen message'}},`

   `key2: [`
      `{name: 'maxLen',rule: {maxLen: 10,message: 'i am maxLen message'}},`

      `{name: 'minLen',rule: {minLen: 2,message: 'i am test2 message'}}]};`

`var keyValues = {`

   `key1: 10,`

   `key2: 8`

`};`
`var keyResult = validate.setKeyRules(keyOptions).validate(keyValues);`

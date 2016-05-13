import postcss from "postcss"

const invertFromSelectorMap = {
  "to": "from",
  "from": "to"
}

function invertPercentageSelector(percent) {
  return percent.split(", ").map((value) => `${100 - parseInt(value, 10)}%`).join(", ")
}

function invertSelector(selector) {
  return invertFromSelectorMap[selector] || invertPercentageSelector(selector)
}

function addAtRules(root, name) {

  const newAtRule = postcss.atRule({name: `keyframes`, params: `${name}` })
  root.append(newAtRule)
  return newAtRule
}

function addRule (selector) {
  return postcss.rule({selector: selector , semicolon: true}) // ensure trailing semi-colon
}

module.exports = postcss.plugin("postcss-reverse-animation", () => {

  return (root, result) => {
    root.walkAtRules(/(keyframes-reversable)$/, (rules) => {

      const atRuleOriginal = addAtRules(root, rules.params)
      const atRuleOriginalReversed = addAtRules(root, `${rules.params}-reversed`)

      root.prepend({ text: 'Inverted keyframes' })

      rules.walkRules( (rule)  => {
        const newRule = addRule(rule.selector)
        const newRuleRevered = addRule(invertSelector(rule.selector))

        rule.walkDecls( (decl) => {
          const declaration = postcss.decl({prop: decl.prop, value: decl.value})
          newRule.append(declaration)
          newRuleRevered.append(declaration)
        })

        atRuleOriginal.append(newRule)
        atRuleOriginalReversed.append(newRuleRevered)
      })

      // remove original
      rules.remove()
    })
  }
})

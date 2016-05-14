import postcss from "postcss"

const invertFromSelectorMap = {
  "to": "from",
  "from": "to",
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

function addRule(selector) {
  return postcss.rule({selector, raws: { semicolon: true}}) // ensure trailing semi-colon
}

function addDeclaration(ruleToWalk, rules) {
  ruleToWalk.walkDecls((decl) => {
    rules.map((rule) => {
      rule.append(postcss.decl({prop: decl.prop, value: decl.value}))
    })
  })
}

module.exports = postcss.plugin("postcss-invert-keyframes", () => {

  return (root) => {
    root.walkAtRules(/(-invert-keyframes)$/, (rules) => {

      const atRuleOriginal = addAtRules(root, rules.params)
      const atRuleOriginalReversed = addAtRules(root, `${rules.params}-inverted`)

      // add css comment
      root.prepend({ text: "Inverted keyframes" })

      rules.walkRules((rule)  => {
        const newRule = addRule(rule.selector)
        const newRuleRevered = addRule(invertSelector(rule.selector))

        addDeclaration(rule, [newRule, newRuleRevered])

        atRuleOriginal.append(newRule)
        atRuleOriginalReversed.append(newRuleRevered)
      })

      // keyframes-reversable from output
      rules.remove()
    })
  }
})

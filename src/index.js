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

function cloneRule(ruleToClone, newRule) {
  ruleToClone.parent.insertBefore(ruleToClone, newRule)
  newRule.source = ruleToClone.source
  return newRule
}

function addAtRules(atrule, name) {

  const newAtRule = postcss.atRule({name: `keyframes`, params: `${name}` })
  return cloneRule(atrule, newAtRule)
}

function addRule(rule, selector) {
  return postcss.rule({selector, raws: { semicolon: true}}) // ensure trailing semi-colon
}

function addDeclaration(ruleToWalk, rules) {
  ruleToWalk.walkDecls((decl) => {
    rules.map((rule) => rule.append(decl.clone({ prop: decl.prop })))
  })
}

module.exports = postcss.plugin("postcss-invert-keyframes", () => {

  return (root) => {
    root.walkAtRules(/(-invert-keyframes)$/, (atrule) => {

      const atRuleNew = addAtRules(atrule, atrule.params)
      const atRuleNewReversed = addAtRules(atrule, `${atrule.params}-inverted`)

      // add css comment
      root.prepend({ text: "Inverted keyframes" })

      atrule.walkRules((rule)  => {
        const newRule = addRule(rule, rule.selector)
        const newRuleRevered = addRule(rule, invertSelector(rule.selector))

        addDeclaration(rule, [newRule, newRuleRevered])

        atRuleNew.append(newRule)
        atRuleNewReversed.append(newRuleRevered)
      })

      // keyframes-reversable from output
      atrule.remove()
    })
  }
})

(module) @local.scope
(function_long_expression) @local.scope
(function_shorthand_expression) @local.scope
[
  (piped_match_arm)
  (unpiped_match_arm)
] @local.scope

(let_expression
  body: (_) @local.scope)

(use_expression
  body: (_) @local.scope)

(let_statement
  pattern: (identifier) @local.definition.function
  value: (_) @__let_value
  (#match? @__let_value "^fn\\b"))

(let_statement
  pattern: (identifier) @local.definition.variable
  value: (_) @__let_value
  (#not-match? @__let_value "^fn\\b"))

(let_expression
  pattern: (identifier) @local.definition.function
  value: (_) @__let_value
  (#match? @__let_value "^fn\\b"))

(let_expression
  pattern: (identifier) @local.definition.variable
  value: (_) @__let_value
  (#not-match? @__let_value "^fn\\b"))

(parameter
  name: (identifier) @local.definition.variable.parameter)

(rest_pattern
  (identifier) @local.definition.variable)

(pattern_field
  name: (identifier) @local.definition.variable
  !value)

(pattern_field
  value: (identifier) @local.definition.variable)

[
  (piped_match_arm
    pattern: (match_arm
      (identifier) @local.definition.variable))

  (unpiped_match_arm
    pattern: (match_arm
      (identifier) @local.definition.variable))
]

(tuple_pattern
  (identifier) @local.definition.variable)

(array_pattern
  (identifier) @local.definition.variable)

(typed_pattern
  pattern: (identifier) @local.definition.variable)

(constructor_pattern
  payload: (identifier) @local.definition.variable)

(identifier) @local.reference

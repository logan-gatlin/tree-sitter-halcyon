[
  "module"
  "bundle"
  "import"
  "use"
  "as"
  "let"
  "type"
  "trait"
  "impl"
  "do"
  "wasm"
  "for"
  "where"
  "root"
  "fn"
  "if"
  "then"
  "else"
  "match"
  "with"
  "in"
  "end"
] @keyword

[
  "="
  "=>"
  "->"
  "+"
  "-"
  "*"
  "/"
  "mod"
  "|>"
  "+>"
  "*>"
  "<<"
  ">>"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "and"
  "or"
  "xor"
  "not"
  "~"
  ";"
] @operator

[
  "(" ")"
  "[" "]"
  "{" "}"
] @punctuation.bracket

[
  ":"
  "::"
  ","
  "."
  "|"
  ".."
] @punctuation.delimiter

(line_comment) @comment.line
(block_comment) @comment.block

(string_literal) @string
(glyph_literal) @string.special
(natural_literal) @number
(integer_literal) @number
(real_literal) @number.float
(boolean_literal) @boolean

(module
  name: (identifier) @namespace)

(bundle_declaration
  name: (identifier) @namespace)

(use_statement
  target: (identifier) @namespace)

(use_statement
  target: (path
    name: (identifier) @namespace))

(use_statement
  alias: (identifier) @namespace)

(use_expression
  target: (identifier) @namespace)

(use_expression
  target: (path
    name: (identifier) @namespace))

(use_expression
  alias: (identifier) @namespace)

(path
  module: (identifier) @namespace)

(type_statement
  name: (identifier) @type)

(trait_statement
  name: (identifier) @type)

(impl_statement
  trait: (identifier) @type)

(impl_statement
  trait: (path
    name: (identifier) @type))

(type_parameter_list
  (identifier) @variable.parameter)

(forall_type
  parameter: (identifier) @variable.parameter)

(type_constraint
  trait: (identifier) @type)

(type_constraint
  trait: (path
    name: (identifier) @type))

(type_expression
  (path
    name: (identifier) @type))

(field_type
  type: (identifier) @type)

(field_type
  type: (path
    name: (identifier) @type))

(typed_pattern
  type: (identifier) @type)

(typed_pattern
  type: (path
    name: (identifier) @type))

(parameter
  type: (identifier) @type)

(parameter
  type: (path
    name: (identifier) @type))

(function_type
  parameter: (identifier) @type)

(function_type
  parameter: (path
    name: (identifier) @type))

(function_type
  result: (identifier) @type)

(function_type
  result: (path
    name: (identifier) @type))

(type_application
  constructor: (identifier) @type)

(type_application
  constructor: (path
    name: (identifier) @type))

(type_application
  argument: (identifier) @type)

(type_application
  argument: (path
    name: (identifier) @type))

(field_type
  type: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(typed_pattern
  type: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(parameter
  type: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(function_type
  parameter: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(function_type
  result: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(type_application
  constructor: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(type_application
  argument: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(type_constraint
  argument: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(forall_type
  body: (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(type_alias_definition
  (identifier) @variable.parameter
  (#match? @variable.parameter "^[a-z][A-Za-z0-9_-]*$"))

(variant
  name: (identifier) @constructor)

(constructor_pattern
  constructor: (identifier) @constructor)

(constructor_pattern
  constructor: (path
    name: (identifier) @constructor))

(let_statement
  pattern: (identifier) @function
  value: (function_expression))

(call_expression
  function: (identifier) @function)

(call_expression
  function: (path
    name: (identifier) @function))

(call_expression
  function: (field_expression
    field: (identifier) @function))

(trait_method_declaration
  name: (identifier) @function)

(impl_method_definition
  name: (identifier) @function)

(parameter
  name: (identifier) @variable.parameter)

(parameter
  name: (identifier
    (word_identifier) @variable.parameter))

(parameter
  name: (identifier
    (operator_identifier) @variable.parameter))

(field_type
  name: (identifier) @property)

(struct_field
  name: (identifier) @property)

(pattern_field
  name: (identifier) @property)

(operator_identifier) @function

/**
 * @file Halcyon grammar for tree-sitter
 * @author Logan Gatlin
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  FIELD: 13,
  CALL: 12,
  UNARY: 11,
  MULTIPLY: 10,
  ADD: 9,
  COMPOSE: 8,
  COMPARE: 7,
  AND: 6,
  OR: 5,
  PIPE: 4,
  SEMICOLON: 3,
  TYPE_APPLY: 2,
  TYPE_ARROW: 1,
  PATTERN_ANNOTATION: 1,
  CONSTRUCTOR_PATTERN: 2,
};

export default grammar({
  name: "halcyon",

  word: $ => $.word_identifier,

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  supertypes: $ => [
    $.top_level_item,
    $.statement,
    $.expression,
    $.pattern,
    $.type_expression,
    $.sexpr_item,
  ],

  rules: {
    source_file: $ => repeat($.top_level_item),

    top_level_item: $ => choice(
      $.bundle_declaration,
      $.import_statement,
      $.statement,
    ),

    bundle_declaration: $ => seq(
      "bundle",
      field("name", $.identifier),
    ),

    import_statement: $ => seq(
      "import",
      commaSep1($.string_literal),
    ),

    module: $ => seq(
      "module",
      field("name", $.identifier),
      "=",
      repeat($.statement),
      "end",
    ),

    statement: $ => choice(
      $.use_statement,
      $.let_statement,
      $.type_statement,
      $.trait_statement,
      $.impl_statement,
      $.wasm_statement,
      $.module,
    ),

    use_statement: $ => seq(
      "use",
      field("target", choice($.identifier, $.path)),
      optional(seq("as", field("alias", $.identifier))),
    ),

    let_statement: $ => choice(
      seq(
        "let",
        "|",
        field("name", $.identifier),
        "=",
        field("value", choice($.identifier, $.path)),
      ),
      seq(
        "let",
        field("pattern", $.pattern),
        "=",
        field("value", $.expression),
      ),
    ),

    type_statement: $ => choice(
      seq(
        "type",
        "~",
        field("name", $.identifier),
        optional($.type_parameter_list),
        "=",
        field("body", $.type_alias_definition),
      ),
      seq(
        "type",
        field("name", $.identifier),
        optional($.type_parameter_list),
        "=",
        field("body", $.type_definition),
      ),
    ),

    type_parameter_list: $ => seq(
      ":",
      repeat1(seq($.identifier, optional(","))),
    ),

    type_definition: $ => choice(
      $.record_type_definition,
      $.sum_type_definition,
      $.type_alias_definition,
    ),

    record_type_definition: $ => seq(
      "{",
      repeat1(seq(choice($.field_type, $.spread_type), optional(","))),
      "}",
    ),

    spread_type: $ => seq("..", field("type", $.type_expression)),

    field_type: $ => seq(
      field("name", $.identifier),
      ":",
      field("type", $.type_expression),
    ),

    sum_type_definition: $ => repeat1($.variant),

    variant: $ => prec.right(seq(
      "|",
      field("name", $.identifier),
      optional(field("payload", $.type_expression)),
    )),

    type_alias_definition: $ => $.type_expression,

    trait_statement: $ => choice(
      seq(
        "trait",
        "~",
        field("name", $.identifier),
        "=",
        field("alias", choice($.identifier, $.path)),
      ),
      seq(
        "trait",
        field("name", $.identifier),
        optional($.type_parameter_list),
        "=",
        repeat($.trait_method_declaration),
        "end",
      ),
    ),

    trait_method_declaration: $ => seq(
      "let",
      field("name", $.identifier),
      ":",
      field("type", $.type_expression),
    ),

    impl_statement: $ => seq(
      "impl",
      field("trait", choice($.identifier, $.path)),
      field("argument", $.type_expression),
      repeat(seq(",", field("argument", $.type_expression))),
      optional(","),
      "=",
      repeat($.impl_method_definition),
      "end",
    ),

    impl_method_definition: $ => seq(
      "let",
      field("name", $.identifier),
      "=",
      field("value", $.expression),
    ),

    wasm_statement: $ => seq(
      "wasm",
      "=>",
      field("body", $.sexpr),
    ),

    type_expression: $ => choice(
      $.forall_type,
      $.function_type,
      $.type_application,
      $._type_atom,
    ),

    forall_type: $ => prec.right(seq(
      "for",
      repeat1(field("parameter", $.identifier)),
      "in",
      field("body", $.type_expression),
      optional(seq(
        "where",
        commaSep1($.type_constraint),
      )),
    )),

    type_constraint: $ => prec.right(seq(
      field("trait", choice($.identifier, $.path)),
      repeat(field("argument", $._type_atom)),
    )),

    function_type: $ => prec.right(PREC.TYPE_ARROW, seq(
      field("parameter", choice($.type_application, $._type_atom)),
      "->",
      field("result", $.type_expression),
    )),

    type_application: $ => prec.left(PREC.TYPE_APPLY, seq(
      field("constructor", $._type_atom),
      field("argument", $._type_atom),
      repeat(field("argument", $._type_atom)),
    )),

    _type_atom: $ => choice(
      $.path,
      $.identifier,
      $.unit_type,
      $.array_type,
      $.tuple_type,
      $.parenthesized_type,
    ),

    unit_type: _ => "()",
    array_type: _ => "[]",

    tuple_type: $ => seq(
      "(",
      $.type_expression,
      ",",
      commaSep1($.type_expression),
      optional(","),
      ")",
    ),

    parenthesized_type: $ => seq("(", $.type_expression, ")"),

    expression: $ => choice(
      $.let_expression,
      $.use_expression,
      $.function_expression,
      $.if_expression,
      $.match_expression,
      $.binary_expression,
      $.unary_expression,
      $.field_expression,
      $.call_expression,
      $._atom,
    ),

    let_expression: $ => seq(
      "let",
      field("pattern", $.pattern),
      "=",
      field("value", $.expression),
      "in",
      field("body", $.expression),
    ),

    use_expression: $ => seq(
      "use",
      field("target", choice($.identifier, $.path)),
      optional(seq("as", field("alias", $.identifier))),
      "in",
      field("body", $.expression),
    ),

    function_expression: $ => choice(
      $.function_shorthand_expression,
      $.function_long_expression,
    ),

    function_long_expression: $ => seq(
      "fn",
      repeat($.parameter),
      "=>",
      field("body", $.expression),
    ),

    function_shorthand_expression: $ => prec.right(seq(
      "fn",
      repeat1($.piped_match_arm),
    )),

    parameter: $ => choice(
      field("name", $.identifier),
      seq(
        "(",
        field("name", $.identifier),
        ":",
        field("type", $.type_expression),
        ")",
      ),
    ),

    if_expression: $ => seq(
      "if",
      field("condition", $.expression),
      "then",
      field("consequence", $.expression),
      "else",
      field("alternative", $.expression),
    ),

    match_expression: $ => prec.right(seq(
      "match",
      field("value", $.expression),
      "with",
      choice(
        seq($.unpiped_match_arm, repeat($.piped_match_arm)),
        repeat1($.piped_match_arm),
      ),
    )),

    piped_match_arm: $ => alias(seq(
      "|",
      field("pattern", $.pattern),
      "=>",
      field("body", $.expression),
    ), $.match_arm),

    unpiped_match_arm: $ => alias(seq(
      field("pattern", $.pattern),
      "=>",
      field("body", $.expression),
    ), $.match_arm),

    inline_wasm_expression: $ => seq(
      "(",
      "wasm",
      ":",
      field("type", $.type_expression),
      ")",
      "=>",
      field("body", $.sexpr),
    ),

    unary_expression: $ => prec.right(PREC.UNARY, seq(
      field("operator", choice("-", "not")),
      field("argument", $.expression),
    )),

    field_expression: $ => prec.left(PREC.FIELD, seq(
      field("object", choice($.call_expression, $._atom)),
      ".",
      field("field", $.identifier),
    )),

    call_expression: $ => prec.left(PREC.CALL, seq(
      field("function", choice($.call_expression, $.field_expression, $._atom)),
      field("argument", choice($.field_expression, $._atom)),
    )),

    binary_expression: $ => choice(
      prec.left(PREC.SEMICOLON, seq($.expression, ";", $.expression)),
      prec.left(PREC.PIPE, seq($.expression, "|>", $.expression)),
      prec.left(PREC.OR, seq($.expression, "or", $.expression)),
      prec.left(PREC.AND, seq($.expression, "and", $.expression)),
      prec.left(PREC.COMPARE, seq($.expression, choice("==", "!=", "<", "<=", ">", ">="), $.expression)),
      prec.left(PREC.COMPOSE, seq($.expression, choice("<<", ">>", "xor"), $.expression)),
      prec.left(PREC.ADD, seq($.expression, choice("+", "-"), $.expression)),
      prec.left(PREC.MULTIPLY, seq($.expression, choice("*", "/", "%"), $.expression)),
    ),

    _atom: $ => choice(
      $.literal,
      $.unit_expression,
      $.path,
      $.identifier,
      $.inline_wasm_expression,
      $.tuple_expression,
      $.parenthesized_expression,
      $.array_expression,
      $.struct_expression,
    ),

    unit_expression: _ => "()",

    tuple_expression: $ => seq(
      "(",
      $.expression,
      ",",
      commaSep1($.expression),
      optional(","),
      ")",
    ),

    parenthesized_expression: $ => seq("(", $.expression, ")"),

    array_expression: $ => seq(
      "[",
      repeat(seq(choice($.array_splat, $.expression), optional(","))),
      "]",
    ),

    array_splat: $ => seq("..", $.expression),

    struct_expression: $ => seq(
      "{",
      commaSep($.struct_field),
      optional(","),
      "}",
    ),

    struct_field: $ => seq(
      field("name", $.identifier),
      choice("=", ":"),
      field("value", $.expression),
    ),

    pattern: $ => choice(
      $.typed_pattern,
      $._pattern_atom,
    ),

    typed_pattern: $ => prec.right(PREC.PATTERN_ANNOTATION, seq(
      field("pattern", $._pattern_atom),
      ":",
      field("type", $.type_expression),
    )),

    _pattern_atom: $ => choice(
      $.constructor_pattern,
      $.path,
      $.identifier,
      $.literal,
      $.unit_pattern,
      $.tuple_pattern,
      $.array_pattern,
      $.struct_pattern,
    ),

    constructor_pattern: $ => prec.right(PREC.CONSTRUCTOR_PATTERN, seq(
      field("constructor", choice($.path, $.identifier)),
      field("payload", $.pattern),
    )),

    unit_pattern: _ => "()",

    tuple_pattern: $ => seq(
      "(",
      $.pattern,
      ",",
      commaSep1($.pattern),
      optional(","),
      ")",
    ),

    array_pattern: $ => seq(
      "[",
      repeat(seq(choice($.rest_pattern, $.pattern), optional(","))),
      "]",
    ),

    rest_pattern: $ => prec.right(seq("..", optional(alias($.word_identifier, $.identifier)))),

    struct_pattern: $ => seq(
      "{",
      commaSep($.pattern_field),
      optional(","),
      "}",
    ),

    pattern_field: $ => seq(
      field("name", $.identifier),
      optional(seq("=", field("value", $.pattern))),
    ),

    sexpr: $ => seq("(", repeat($.sexpr_item), ")"),

    sexpr_item: $ => choice(
      $.sexpr,
      $.sexpr_path,
      $.sexpr_field,
      $.sexpr_symbol_identifier,
      $.sexpr_identifier,
      $.string_literal,
      $.integer_literal,
      $.real_literal,
      $.boolean_literal,
    ),

    sexpr_path: $ => seq(
      "$",
      field("module", $.word_identifier),
      "::",
      field("name", $.word_identifier),
    ),

    sexpr_symbol_identifier: $ => seq("$", $.sexpr_identifier),

    sexpr_field: $ => seq(
      field("object", $.sexpr_identifier),
      ".",
      field("field", $.sexpr_identifier),
    ),

    literal: $ => choice(
      $.integer_literal,
      $.real_literal,
      $.string_literal,
      $.glyph_literal,
      $.boolean_literal,
    ),

    boolean_literal: _ => choice("true", "false"),

    path: $ => seq(
      choice(
        seq(
          "root",
          "::",
          repeat(seq(field("module", $.identifier), "::")),
        ),
        seq(
          "bundle",
          "::",
          repeat(seq(field("module", $.identifier), "::")),
        ),
        repeat1(seq(field("module", $.identifier), "::")),
      ),
      field("name", $.identifier),
    ),

    identifier: $ => choice(
      $.word_identifier,
      $.operator_identifier,
    ),

    operator_identifier: $ => seq("[", $.operator_symbol, "]"),

    operator_symbol: _ => choice(
      "+",
      "-",
      "*",
      "/",
      "%",
      "|>",
      "<<",
      ">>",
      "==",
      "!=",
      "<",
      "<=",
      ">",
      ">=",
      "and",
      "or",
      "xor",
      "not",
      "~",
      ";",
    ),

    word_identifier: _ => token(/[A-Za-z_][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)*/),
    sexpr_identifier: $ => choice(
      alias($.word_identifier, $.sexpr_identifier),
      alias("-", $.sexpr_identifier),
      alias("module", $.sexpr_identifier),
      alias("import", $.sexpr_identifier),
      alias("use", $.sexpr_identifier),
      alias("as", $.sexpr_identifier),
      alias("end", $.sexpr_identifier),
      alias("match", $.sexpr_identifier),
      alias("with", $.sexpr_identifier),
      alias("let", $.sexpr_identifier),
      alias("type", $.sexpr_identifier),
      alias("trait", $.sexpr_identifier),
      alias("impl", $.sexpr_identifier),
      alias("do", $.sexpr_identifier),
      alias("of", $.sexpr_identifier),
      alias("in", $.sexpr_identifier),
      alias("if", $.sexpr_identifier),
      alias("then", $.sexpr_identifier),
      alias("else", $.sexpr_identifier),
      alias("and", $.sexpr_identifier),
      alias("or", $.sexpr_identifier),
      alias("xor", $.sexpr_identifier),
      alias("not", $.sexpr_identifier),
      alias("fn", $.sexpr_identifier),
      alias("wasm", $.sexpr_identifier),
      alias("root", $.sexpr_identifier),
    ),

    integer_literal: _ => token(choice(
      /0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*/,
      /0[oO][0-7](?:_?[0-7])*/,
      /0[bB][01](?:_?[01])*/,
      /0[dD][0-9](?:_?[0-9])*/,
      /[0-9](?:_?[0-9])*/,
    )),

    real_literal: _ => token(choice(
      /[0-9](?:_?[0-9])*\.[0-9](?:_?[0-9])*(?:[eE][+-]?[0-9](?:_?[0-9])*)?/,
      /[0-9](?:_?[0-9])*(?:[eE][+-]?[0-9](?:_?[0-9])*)/,
    )),

    string_literal: _ => token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),
    glyph_literal: _ => token(seq("'", repeat(choice(/[^'\\]/, /\\./)), "'")),

    line_comment: _ => token(seq("--", /[^\n]*/)),
    block_comment: _ => token(seq("(*", /[^*]*\*+([^(*][^*]*\*+)*/, ")")),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

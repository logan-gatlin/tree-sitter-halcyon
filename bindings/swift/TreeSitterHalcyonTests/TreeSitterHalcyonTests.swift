import XCTest
import SwiftTreeSitter
import TreeSitterHalcyon

final class TreeSitterHalcyonTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_halcyon())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Halcyon grammar")
    }
}

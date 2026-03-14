// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterHalcyon",
    products: [
        .library(name: "TreeSitterHalcyon", targets: ["TreeSitterHalcyon"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterHalcyon",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterHalcyonTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterHalcyon",
            ],
            path: "bindings/swift/TreeSitterHalcyonTests"
        )
    ],
    cLanguageStandard: .c11
)

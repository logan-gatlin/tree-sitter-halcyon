package tree_sitter_halcyon_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_halcyon "github.com/tree-sitter/tree-sitter-halcyon/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_halcyon.Language())
	if language == nil {
		t.Errorf("Error loading Halcyon grammar")
	}
}

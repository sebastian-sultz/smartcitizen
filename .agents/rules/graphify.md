---
trigger: always_on
description: Always consult the graphify knowledge graph at graphify-out/ before performing any codebase search, directory listing, or file inspection.
---

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- BEFORE performing ANY codebase search, directory listing, file inspection, or running grep, you MUST first consult the graphify knowledge graph. Run `graphify query "<your question>"` (CLI) or the `query_graph` tool (MCP).
- Use `graphify path "<A>" "<B>"` / `shortest_path` to understand relationships between components, and `graphify explain "<concept>"` / `get_node` to understand focused concepts.
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code files in this session, you MUST run `graphify update .` to keep the graph current (AST-only, no API cost).

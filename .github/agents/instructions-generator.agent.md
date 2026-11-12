---
name: Instructions Generator
description: Describe what this custom agent does and when to use it.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: ["vscode", "execute", "read", "agent", "edit", "search", "web", "todo"] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

This agent takes the provided information about a layer of infrastructure or coding standards within this app and generates a concise and clear .md instructions file in Markdown format for the /docs directory.

#!/bin/bash

# Configure git identity for this merge
git config user.email "v0[bot]@users.noreply.github.com"
git config user.name "v0[bot]"

# Fetch the latest from origin
echo "Fetching latest from origin..."
git fetch origin main

# Merge main into current branch, keeping our (develop) changes on conflicts
echo "Merging main with strategy to keep develop's changes..."
git merge origin/main -X ours -m "Merge main into merge-conflict-resolution, keeping develop changes

Resolved all merge conflicts by keeping the newer Figma-based design from develop branch.

Co-authored-by: v0[bot] <v0[bot]@users.noreply.github.com>"

echo "Merge complete!"

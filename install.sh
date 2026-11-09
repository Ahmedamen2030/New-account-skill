#!/usr/bin/env bash
# Install premium-website-studio as a global (personal) Claude Code skill: ~/.claude/skills/premium-website-studio
# Usage: bash install.sh [--force]
set -euo pipefail
SRC="$(cd "$(dirname "$0")" && pwd)/premium-website-studio"
DEST="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/premium-website-studio"
# Backups must live OUTSIDE skills/, or Claude Code loads them as a duplicate skill.
BACKUP_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skill-backups"
if [ -e "$DEST" ] && [ "${1:-}" != "--force" ]; then
  echo "Already exists: $DEST"
  echo "Inspect it first; re-run with --force to replace it (the old copy is moved to $BACKUP_DIR/)."
  exit 1
fi
if [ -e "$DEST" ]; then mkdir -p "$BACKUP_DIR"; mv "$DEST" "$BACKUP_DIR/premium-website-studio-$(date +%Y%m%d%H%M%S)"; fi
mkdir -p "$(dirname "$DEST")"
cp -R "$SRC" "$DEST"
rm -rf "$DEST/evals"   # test cases are for development, not needed at runtime
echo "Installed to $DEST"
echo "Start a new Claude Code session, then try: /premium-website-studio  (or just describe a website project)"

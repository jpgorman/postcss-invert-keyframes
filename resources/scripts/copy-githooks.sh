#!/bin/bash
cp -Ri resources/githooks/. \.git/hooks
chmod +x \.git/hooks/pre-push
chmod +x \.git/hooks/pre-commit

#!/bin/bash
# Build and serve production version
npm run build
NODE_ENV=production tsx server/index.ts
#!/bin/bash
# Docker Build Script with Optimization

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo -e "${BLUE}🚀 Yellow Book - Docker Build Script${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Create .env file before running docker compose"
    echo ""
fi

# Parse arguments
FAST_MODE=false
NO_CACHE=false
DETACHED=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --fast)
            FAST_MODE=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --attached|-a)
            DETACHED=false
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: ./build.sh [--fast] [--no-cache] [--attached|-a]"
            exit 1
            ;;
    esac
done

# Determine which compose file to use
if [ "$FAST_MODE" = true ]; then
    COMPOSE_FILE="docker-compose.fast.yml"
    echo -e "${GREEN}⚡ Using BuildKit optimized Dockerfiles${NC}"
else
    COMPOSE_FILE="docker-compose.yml"
    echo -e "${GREEN}📦 Using standard Dockerfiles${NC}"
fi

# Build command
BUILD_CMD="docker compose -f $COMPOSE_FILE"

if [ "$NO_CACHE" = true ]; then
    echo -e "${YELLOW}🔨 Building without cache...${NC}"
    $BUILD_CMD build --no-cache
else
    echo -e "${YELLOW}🔨 Building with cache...${NC}"
    $BUILD_CMD build
fi

# Start containers
if [ "$DETACHED" = true ]; then
    echo -e "${BLUE}🚀 Starting containers in detached mode...${NC}"
    $BUILD_CMD up -d
    echo ""
    echo -e "${GREEN}✅ Build complete!${NC}"
    echo ""
    echo "View logs with:"
    echo "  docker compose logs -f"
    echo ""
    echo "Check status:"
    echo "  docker compose ps"
else
    echo -e "${BLUE}🚀 Starting containers (attached mode)...${NC}"
    echo "Press Ctrl+C to stop"
    echo ""
    $BUILD_CMD up
fi


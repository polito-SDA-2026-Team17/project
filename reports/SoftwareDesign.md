# Software Design Report


## Architecture Integration Summary

The structure of `packages/react-native` demonstrates key architectural principles:

### Separation of Concerns

- **Platform Independence:** Libraries/ and ReactCommon/
- **Platform Specificity:** ReactAndroid/ and ReactApple/
- **Tooling/Infrastructure:** scripts/, template/, and jest/

### Layered Architecture

This structure exemplifies a Layered Architecture where:
- **Top Layer (JS):** Platform-agnostic JavaScript components
- **Middle Layer (C++):** ReactCommon provides cross-platform abstractions and performance optimization
- **Bottom Layer (Native):** Platform-specific implementations (ReactAndroid/ and ReactApple/)

The top layer (JS) is effectively decoupled from the bottom layer (Native) by a robust C++ middleware (ReactCommon), enabling React Native's core promise: write once, run on any platform.

---

# Software Design Report

## Internal Structure of packages/react-native

The `packages/react-native` directory represents the core "engine" and public JavaScript API of the React Native framework. This folder contains the critical implementation responsible for managing multi-platform complexity through a carefully layered architecture.

---

## 1. Libraries/

**The Heart of JavaScript-Side Implementation**

The Libraries directory is organized into functional modules that provide the declarative API for developers.

**Content:** Subdirectories including Components/, Core/, Image/, Text/, Utilities/, and Renderer/.

**Features:**
- **Abstraction Layer:** Defines cross-platform JS components (e.g., `<View>`, `<Text>`) that developers use in their applications.
- **Polyfills:** Houses environmental setup (InitializeCore.js) to make the JS environment feel consistent across iOS and Android.
- **Native Modules:** Contains JS definitions for internal APIs like NativeEventEmitter and NativeModules.

**Design Role:** Acts as the Facade for the entire framework, hiding the complexity of native platform implementations behind a unified React API.

---

## 2. ReactAndroid/

**Android Platform Implementation**

This folder contains the specialized code required to run React Native on the Android platform.

**Content:** Java and Kotlin source code, JNI (Java Native Interface) C++ bindings, and Gradle build configurations.

**Features:**
- **View Managers:** Java classes that map JS components to Android-specific views (e.g., mapping `<View>` to ViewGroup).
- **Bridge Logic:** Implements the communication channel on the Android side to receive messages from the JS thread.
- **Native Modules:** Android-specific implementations of hardware APIs (Camera, Vibration, etc.).

**Design Role:** Represents the Implementation side of the Bridge pattern for the Android OS.

---

## 3. ReactApple/ (formerly React/)

**Apple Platform Implementation**

This is the equivalent of ReactAndroid but targeted at Apple platforms (iOS, macOS, tvOS, and visionOS).

**Content:** Objective-C, Objective-C++, and Swift files. It includes the RCT (React) prefixed classes.

**Features:**
- **Rendering:** Contains the code for the Fabric renderer on iOS and the layout integration with UIKit.
- **Lifecycle Management:** Handles the application state transitions (Background/Foreground) within the iOS ecosystem.

**Design Role:** Like its Android counterpart, this serves as the Implementation for the Apple ecosystem within the Bridge pattern.

---

## 4. ReactCommon/

**The Critical Shared C++ Core**

ReactCommon is arguably the most critical folder for software design, as it contains the shared C++ core that unifies cross-platform behavior.

**Content:** C++ headers and implementation files for yoga (layout engine), jsi (JavaScript Interface), fabric (new renderer), and turbomodule.

**Features:**
- **Performance:** By moving core logic to C++, React Native ensures that performance-intensive tasks like layout calculation (Yoga) are shared and optimized across all platforms.
- **JSI (JavaScript Interface):** The foundational layer that allows JS to hold a reference to C++ host objects, enabling synchronous calls.

**Design Role:** Implements the Strategy Pattern for cross-platform layout and the Mediator Pattern for high-performance communication between JS and Native.

---

## 5. scripts/

**Automation and Framework Distribution**

While not part of the runtime code, these scripts are essential for the framework's architecture and distribution.

**Content:** Shell scripts, Node.js scripts, and Ruby scripts (for CocoaPods).

**Features:**
- **Codegen:** Scripts that automatically generate the C++ and Java glue code from JS Flow/TypeScript definitions.
- **CLI Integration:** Tools used by the React Native CLI to link libraries or start the Metro packager.

**Design Role:** Automates Generative Programming, ensuring type safety between JS and Native without manual boilerplate.

---

## 6. sdks/

**External and Embedded SDK Management**

This folder manages external or embedded SDKs that the core framework depends on.

**Content:** Typically houses the hermes-engine configurations and pre-built binaries.

**Features:**
- **Execution Environment:** Manages the integration of the Hermes JavaScript engine, which is optimized for fast startup on mobile devices.

**Design Role:** Acts as a Wrapper for the execution engine, decoupling the framework logic from the specific JS engine being used.

---

## 7. template/

**Application Blueprint and Standardization**

Contains the "blueprint" for every new React Native project.

**Content:** The basic folder structure (ios/, android/, App.tsx) that a user gets when running `npx react-native init`.

**Features:**
- **Standardization:** Ensures every app starts with a predictable design that the core framework can hook into.

**Design Role:** Represents the Prototype pattern for user-land applications.

---

## 8. jest/

**Testing Infrastructure**

Contains the testing infrastructure and mocks for the entire package.

**Content:** Jest setup files and mocks for native components.

**Features:**
- **Unit Testing:** Provides the environment needed to test JS components without needing a physical device or emulator.

**Design Role:** Implements Mock Objects to decouple testing from hardware-dependent native modules.

---

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

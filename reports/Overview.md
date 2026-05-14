# Report 1: System Overview

# React Native

## System Purpose and Stakeholders
**Purpose:** To enable developers the building of  native mobile, web, and desktop applications using React and JavaScript/TypeScript, sharing a single codebase across multiple platforms.

**Main Stakeholders:** : 
1. **Mobile Application Developers** : The primary users who utilize the framework to build, test, and deploy applications.
2. **Code Maintainers** : Meta and community leads who maintain the systems architecture, ensure reliability and manage pull requests from third party contributors.

## System Description
**React Native** is a cross platform UI framework developed by Meta that enables developers to build production ready, natively rendering mobile applications for iOS and Android using a shared JavaScript and React codebase. 

By utilizing familiar web style development patterns and JSX markup, the system bridges the gap between web development and native execution without relying on HTML/CSS WebViews. Under the hood, a JavaScript runtime interprets the code and communicates with native platform threads via a C++ core architecture. 

The framework directly invokes platform APIs in Objective-C or Java. This architecture translates JavaScript logic into platform specific native UI primitives such as, iOS's `UIView` or Android's `ViewGroup` and grants direct access to hardware features like the camera or GPS. Ultimately, this allows developers to maintain a mostly unified codebase while delivering complex applications that look, feel, and perform exactly like traditional native software.

## Basic Code Statistics
**Number of Files:** : 6960 files 

**Lines of Code (LOC):** : 757832 

**Modules/Packages:** : Since this is a massive project, it is strucutred as a *Yarn Workspace monorepo*, not a single package, but a collection of packages modules that share a root set of dependencies. According to the root package.json, the modules are located in the **packages/*** and **private/*** directories. Dependencies are a lot to count manually as different modules have different dependencies based on their functionality.

**Number of Developers:** : 2821 Github contributors 

**Language/Tech Stack:** : Assembly, C, C++, HTML,CSS, JavaScript, TypeScript, Java, Kotlin, Objective-C , Objective-C++, Python, Ruby, Bash Scripts (Shell), Swift. 

![alt text](../images/image.png)

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


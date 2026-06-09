# System Overview: React Native (Architecture Focus)

## 1. Purpose of the System and Main Stakeholders

**Purpose:**
React Native is an open-source framework created by Meta that allows developers to build cross-platform mobile applications (Android, iOS) using a single JavaScript codebase. It bridges declarative React UI components directly to native OS rendering APIs, delivering native-level performance. The recent "New Architecture" optimizes this by replacing the legacy asynchronous bridge with the JavaScript Interface (JSI), enabling synchronous, shared-memory communication between JavaScript and the native C++ core.

**Main Stakeholders:**
* **Mobile Developers:** Primary users utilizing the API to build applications.
* **Meta Platforms, Inc.:** Original creator, core maintainer, and primary corporate sponsor.
* **Open-Source Community:** Contributors providing bug fixes, third-party libraries, and architectural proposals.
* **End Users:** Consumers of the mobile applications whose experience relies on the framework's native responsiveness.

## 2. System Description and Basic Code Statistics

**System Description:**
The framework operates on a hybrid architecture divided into two primary environments:
1. **JS Framework Layer:** Developers write business logic here using JS/TypeScript. This layer utilizes the React library to manage state and compute UI component tree changes (Reconciliation).
2. **Shared C++ Runtime Core & Adapters:** Computed changes are passed synchronously via JSI to the platform-agnostic C++ core (Fabric engine). This core calculates flexbox geometries using the external Yoga engine and generates abstract layout mutations. Finally, **Platform Adapters** translate these C++ commands into native rendering methods (JNI for Android, Objective-C++ for iOS).

**Basic Code Statistics:**
The statistics below represent the repository's core framework and platform adapters (excluding third-party `node_modules` and test artifacts).

* **Total Number of Files:** 7,001
* **Total Lines of Code:** 963,539 (726,978 lines of executable source code)
* **Primary Programming Languages:**
    * JavaScript / TypeScript: ~342,000 LOC (JS Framework API)
    * C++ / C Headers: ~149,000 LOC (Shared Runtime Core & JSI)
    * Kotlin / Java: ~89,000 LOC (Android Platform Adapters)
    * Objective-C++ / Swift: ~53,000 LOC (Apple Platform Adapters)
* **Main Modules:** `Libraries` (JS APIs), `ReactCommon` (C++ Core), `ReactAndroid`, `React` (Apple/iOS).
* **Number of Contributors:** 3,929
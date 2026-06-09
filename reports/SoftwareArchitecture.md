# Software Architecture Document: React Native (New Architecture)

## 1. Tooling Declaration
The architectural models and diagrams presented in this report were generated using **Structurizr DSL**. This tool was explicitly selected to ensure a strictly "architecture as code" approach to C4 diagramming. By defining the architecture programmatically, we prevent arbitrary visual inconsistencies across zoom levels and guarantee that the hierarchical relationships (Input/Output dependencies) remain mathematically consistent from Level 1 down to Level 3.

---

## 2. Level 1: System Context Diagram

**Diagram Reference:**
*(Insert Level 1 Diagram Here)*

**Description:**
The Context diagram defines the macro-boundaries of the React Native Framework and its interactions with external software systems. The framework acts as a central operational hub for cross-platform mobile UI rendering. It operates by coordinating several standalone external systems:
* **React:** The external declarative UI library utilized by developers to define state management, hooks, and component life-cycles.
* **JS Runtime (Hermes):** The external execution engine specifically optimized for React Native. It parses and evaluates JavaScript bytecode, manages garbage collection on the JS thread, and interacts directly with the C++ core via JSI.
* **Yoga Layout Engine:** A standalone, cross-platform layout engine that implements Flexbox. React Native delegates the mathematical calculation of UI coordinates and geometry to this external C/C++ library.
* **Android / iOS Platforms:** The ultimate targets of the framework. React Native pushes abstract initialization commands and native rendering instructions to these host operating systems.

*(Note: Human actors, such as Mobile Developers or End Users, are deliberately excluded from this boundary to strictly model the system-to-system integrations of the framework's runtime environment.)*

---

## 3. Level 2: Container Diagram

**Diagram Reference:**
*(Insert Level 2 Diagram Here)*

**Description:**
The Container diagram decomposes the React Native Framework into its primary deployable and executable boundaries. The architecture is distinctly divided into a JavaScript-driven API layer and a C++/Native-driven processing layer.

* **JS Framework Layer:** Encapsulates the developer-facing APIs, core UI primitives, and the React tree calculation algorithms. It processes developer code and prepares standardized, synchronous rendering requests.
* **Shared C++ Runtime Core:** The central engine of the New Architecture (codenamed Fabric). It manages JSI bindings, maintains the immutable C++ Shadow Tree, and processes synchronous logic independently of the host OS SDKs.
* **React Android & React Apple Adapters:** Low-level boundary containers responsible for translating abstract C++ layout mutation instructions into concrete native UI rendering commands (using JNI for Android and Objective-C++ bindings for iOS).

### 3.1. Excluded Containers: React Native Codegen
To maintain the architectural integrity of a runtime execution model, **React Native Codegen** was explicitly excluded from the C4 diagrams. Codegen is a build-time CLI utility responsible for generating static C++ boilerplate. Including a build-time tool within a Level 2 or Level 3 runtime workflow creates a severe Input/Output inconsistency; thus, it was omitted to strictly document the system's runtime architecture.

### 3.2. Relationship with Clean Architecture
The framework's Level 2 containers exhibit a strict alignment with Clean Architecture blueprint, specifically regarding the Dependency Rule:
* **Entities / Enterprise Business Rules:** The `Shared C++ Runtime Core` acts as the high-level policy center. It encapsulates the core architectural rules of the framework: UI node structuring, diffing algorithms, and native module routing. This core possesses zero knowledge of the outside world (Android `ViewGroup` or iOS `UIView`).
* **Interface Adapters:** The `JS Framework Layer` functions as the interface adapter, translating declarative React code into JSI commands.
* **Frameworks & Drivers:** The `Platform Adapters` represent the outermost detail layer. Dependencies point strictly inward: Adapters depend on the C++ Core to receive UI mutation lists, but the C++ Core never depends on the Adapters.

---

## 4. Level 3: Component Diagrams and Motivations

To comply with the requirement to motivate architectural decisions, we deliberately expanded two specific containers into Level 3 Component diagrams while excluding others. 
* **Excluded - Platform Adapters:** Platform Adapters act merely as dumb boundary translation mechanisms lacking internal policy routing or complex architectural algorithms. Thus, they were not expanded.
* **Expanded Containers:** The `JS Framework Layer` and the `Shared C++ Runtime Core` were expanded to thoroughly illustrate how declarative state management algorithms route data downwards, and how the new synchronous Fabric engine processes these instructions.

### 4.1. Component Diagram: JS Framework Layer

**Diagram Reference:**
*(Insert Level 3 JS Framework Layer Diagram Here)*

**Component Descriptions:**
This diagram illustrates the upper half of the architecture, where developer logic is parsed and reconciled.
* **React Core Library:** The foundational package that manages the component lifecycle, state hooks (e.g., `useState`, `useEffect`), and declarative UI definitions.
* **Core Components API:** Exposes React Native specific UI primitives (e.g., `<View>`, `<Text>`, `<ScrollView>`, `StyleSheet`) to the mobile developer.
* **React Native Reconciler:** A specialized implementation of the React diffing algorithm. It calculates state changes in the JS component tree and determines what UI updates need to be pushed to the native layer.
* **TurboModule JS Bindings:** Strongly typed interfaces (typically TypeScript/Flow) that declare the methods available in the underlying native C++ modules, ensuring type safety before execution.
* **JSI Interop Gateway:** Acts as the strict architectural boundary router. It intercepts JS calls from the Reconciler and TurboModules, converting them into synchronous C++ JSI function invocations, ensuring complete I/O consistency with the Level 2 diagram.

### 4.2. Component Diagram: Shared C++ Runtime Core

**Diagram Reference:**
*(Insert Level 3 Shared C++ Runtime Core Diagram Here)*

**Component Descriptions:**
This diagram details the internal C++ pipeline responsible for synchronous UI rendering (Fabric) and logic processing (TurboModules).
* **JSI Engine Bridge:** The single entry point exposing C++ `HostObjects` to the JS runtime. It allows JavaScript to directly invoke C++ memory without JSON serialization.
* **Fabric Scheduler:** The orchestrator of the rendering pipeline. It manages the Render, Commit, and Mount phases, coordinates thread prioritization, and enables background UI calculations.
* **TurboModules Engine:** Manages the registry and dynamic loading path for native modules, allowing modules to be initialized lazily only when required by the JS layer.
* **Shadow Tree Manager:** Constructs and maintains the C++ Shadow Tree—a hierarchy of immutable nodes representing the UI. It delegates the complex calculation of flexbox coordinates to the external Yoga engine.
* **Mounting Coordinator:** Compares the newly calculated shadow tree with the previously rendered tree. It generates a highly optimized, abstract list of mutation operations (Create, Update, Delete nodes) and sends this list to the Platform Adapters.

### 4.3. SOLID Principles Observation at Level 3
An analysis of the Level 3 C++ Core reveals strict adherence to, and potential risks regarding, SOLID principles:
* **Single Responsibility Principle (SRP):** Strongly adhered to. In the legacy architecture, a monolithic `UIManager` handled tree management, diffing, and scheduling. In the New Architecture, responsibilities are cleanly segregated: `Fabric Scheduler` only schedules, `Shadow Tree Manager` only holds tree state, and `Mounting Coordinator` only calculates diffs.
* **Open/Closed Principle (OCP):** Supported by the `TurboModules Engine`. The architecture allows developers to inject new native capabilities (Open for extension) without modifying the internal C++ core or the JSI bridge (Closed for modification) via standardized C++ interfaces.
* **Interface Segregation Principle (ISP) Risk:** The `JSI Engine Bridge` presents a potential ISP violation. By acting as a massive, centralized router for all JS-to-C++ communications, it risks forcing various independent internal modules to depend on a single, monolithic interface definition rather than narrow, client-specific interfaces.

---

## 5. Architectural Characteristics & Metrics

### 5.1. Key Characteristics
1. **Interoperability:** Achieved natively via the JSI (JavaScript Interface). Unlike the legacy architecture that relied on asynchronous JSON serialization over a bridge, JSI allows JavaScript and C++ to share the same memory space, enabling direct, synchronous method invocations.
2. **Portability:** The core layout and logic engines (`ReactCommon`) are written entirely in cross-platform C++14/C++17. This isolates the complex rendering logic from OS-specific SDKs, allowing the framework to be easily ported to Windows, macOS, or VR platforms.
3. **Performance & Responsiveness:** By splitting the render pipeline into concurrent components, the architecture supports thread-safe background rendering. The `Shadow Tree Manager` computes complex layouts on a background thread, preventing the main UI thread from blocking and eliminating frame drops during complex animations.

### 5.2. Coupling and Cohesion Analysis
The architectural design enforces high cohesion and low coupling, critical for long-term maintainability:
* **High Cohesion:** The `Shared C++ Runtime Core` demonstrates extremely high functional cohesion. All logic related to processing the Fabric pipeline (shadow tree management, layout calculation, diff generation) is tightly encapsulated within this single domain.
* **Low Coupling:** There is strictly minimal coupling between the C++ core and the native operating systems. The core utilizes data-centric coupling; it passes generic mutation instructions (e.g., "Create node X at coordinate Y") to the Adapters. Because the core has zero awareness of native classes (like Android's `ViewGroup`), breaking changes in native iOS or Android SDKs do not cascade into the core C++ logic.

---

## 6. Lines of Code (LOC) Analysis

The static code analysis metrics below demonstrate the distribution of the framework across its defined architectural containers. The data highlights the massive structural footprint of the JS API layer and the centralized C++ core. *(Analyzed using the `cloc` CLI tool on the active runtime repository, excluding tests, build artifacts, and third-party dependencies).*

| Container / Layer | Primary Languages | Total Lines of Code (Code Only) |
| :--- | :--- | :--- |
| **JS Framework Layer** | JavaScript (327,812), TypeScript (14,488) | **342,300** |
| **Shared C++ Runtime Core** | C++ (92,476), C/C++ Headers (56,854) | **149,330** |
| **React Android Adapter** | Kotlin (83,229), Java (6,299) | **89,528** |
| **React Apple Adapter** | Obj-C++ (41,553), Obj-C (10,605), Swift (930) | **53,088** |
| **Total Mapped Architecture** | | **634,246** |
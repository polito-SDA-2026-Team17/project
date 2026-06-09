# Individual Project Journal: 361308 Raul Oppezzo

## Activity Log
| Date | Activity Description | Effort (Hours) | Related Report Section |
| :--- | :--- | :--- | :--- |
| 2026-04-20 | Review of React Native official documentation and New Architecture guides | 2.0 | Overview: Technical Background |
| 2026-04-20 | Review of React Native architecture documentation and codebase | 2.5 | Overview: Technical Background |
| 2026-05-05 | Revision of React Native System Context Diagram (L1) | 1.5 | Architecture: System Context |
| 2026-05-06 | Definition of Container boundaries (L2) for the New Architecture | 2.5 | Architecture: Container Level |
| 2026-05-23 | Setup of Structurizr Local workspace, Docker Compose file, and architecture report structure | 1.5 | Architecture: Structurizr Integration |
| 2026-05-28 | Revision of React Native Container Diagram (L2) and System Context Diagram (L1) | 1.5 | Architecture |
| 2026-05-29 | Definition of Component Diagram (L3) scope and content | 2.5 | Architecture: Component Level |
| 2026-06-05 | Diagrams refactoring | 1.0 | Architecture |
| 2026-06-08 | Report | 2.5 | Architecture |
| 2026-06-09 | Report | 2.5 | Architecture |

## Detailed Contributions
### 2026-04-20 [Overview: Technical Background]
**Specific Contribution:** I performed an in-depth review of the official React Native documentation, specifically focusing on the "New Architecture" section. I analyzed the conceptual shift from the legacy asynchronous Bridge to the JavaScript Interface (JSI). This included studying the roles of Fabric (the new rendering system) and TurboModules (the new native module system), providing the theoretical foundation necessary for the reverse engineering of the framework's internal communication protocols.

**Specific Contribution:** Conducted a targeted review of React Native architecture documentation and examined the codebase. Identified key modules, and files, and documented findings to inform diagram scoping and component identification.

### 2026-05-06 [Architecture: System Context]
**Specific Contribution:** I revised the Level 1 diagram to accurately reflect the interaction flow between the end-user and the mobile platforms (iOS/Android). I expanded the system boundary by introducing essential external entities: the Metro Bundler, Package Registries (npm/Maven/CocoaPods), and third-party Native Modules. I also clarified the relationship between React Native and the React Library, highlighting how the former extends the latter's reconciliation logic for mobile environments.

### 2026-05-06 [Architecture: Container Level]
**Specific Contribution:** I drafted the C4 Level 2 diagram, defining the core execution units of the framework. I established the JS Runtime Container and the Native Host Container as distinct deployable units. I justified the decision to keep the Native Host as a unified container for architectural clarity while documenting its multi-language nature (C++, Java/Kotlin, and Swift/Obj-C). This level explains how the JS bundle is served by Metro and executed within the Hermes engine.

### 2026-05-23 [Architecture: Structurizr Integration]
**Specific Contribution:** I organized the architecture documentation around Structurizr by creating a reusable DSL workspace, adding a root-level Docker Compose file for local execution, and updating the Software Architecture report to describe the C4 System Context and Container views. This makes the diagram generation process reproducible and keeps the architecture source of truth inside the repository.

### 2026-05-28 [Architecture: System and Container Level]
**Specific Contribution:** I refactored the C4 Level 1 and 2 diagrams, moving the JS Runtime Container as an external system (Hermes). The Container Level (L2) now contains mainly a C++ Core, the JS Framework and Native Platform Adapters (which communicate with the underlying platform).

### 2026-05-29 [Architecture: Component Level]
**Specific Contribution:** I attepted to model the C++ Core components. I mainly focused on the new architecture, I have identified the JSI Layer, the Fabric (in charge of orchestrating UI commits, coordinates runtime threads, and prioritizes layout rendering work), and the Mounting Cordinator (in charge of computing differences between shadow trees and generates layout mutation lists).

### 2026-06-05 [Architecture]
**Specific Contribution**: Refactored L1, L2, L3 diagrams, following feedback guidelines.

### 2026-06-08 [Architecture: Report]
**Specific Contribution:** Drafted the core Architecture report sections.

### 2026-06-09 [Architecture: Report — Finalization]
**Specific Contribution:** Integrated clean architecture discussion and architecture characteristics.

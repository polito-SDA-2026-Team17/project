# Individual Project Journal: 361308 Raul Oppezzo

## Activity Log
| Date | Activity Description | Effort (Hours) | Related Report Section |
| :--- | :--- | :--- | :--- |
| 2026-04-20 | Review of React Native official documentation and New Architecture guides | 1.5 | Overview: Technical Background |
| 2026-05-05 | Revision of React Native System Context Diagram (L1) | 1.5 | Architecture: System Context |
| 2026-05-06 | Definition of Container boundaries (L2) for the New Architecture | 2.5 | Architecture: Container Level |
| 2026-05-23 | Setup of Structurizr Local workspace, Docker Compose file, and architecture report structure | 1.5 | Architecture: Structurizr Integration |

## Detailed Contributions
### 2026-04-20 [Overview: Technical Background]
**Specific Contribution:** I performed an in-depth review of the official React Native documentation, specifically focusing on the "New Architecture" section. I analyzed the conceptual shift from the legacy asynchronous Bridge to the JavaScript Interface (JSI). This included studying the roles of Fabric (the new rendering system) and TurboModules (the new native module system), providing the theoretical foundation necessary for the reverse engineering of the framework's internal communication protocols.

### 2026-05-06 [Architecture: System Context]
**Specific Contribution:** I revised the Level 1 diagram to accurately reflect the interaction flow between the end-user and the mobile platforms (iOS/Android). I expanded the system boundary by introducing essential external entities: the Metro Bundler, Package Registries (npm/Maven/CocoaPods), and third-party Native Modules. I also clarified the relationship between React Native and the React Library, highlighting how the former extends the latter's reconciliation logic for mobile environments.

### 2026-05-06 [Architecture: Container Level]
**Specific Contribution:** I drafted the C4 Level 2 diagram, defining the core execution units of the framework. I established the JS Runtime Container and the Native Host Container as distinct deployable units. I justified the decision to keep the Native Host as a unified container for architectural clarity while documenting its multi-language nature (C++, Java/Kotlin, and Swift/Obj-C). This level explains how the JS bundle is served by Metro and executed within the Hermes engine.

### 2026-05-23 [Architecture: Structurizr Integration]
**Specific Contribution:** I organized the architecture documentation around Structurizr by creating a reusable DSL workspace, adding a root-level Docker Compose file for local execution, and updating the Software Architecture report to describe the C4 System Context and Container views. This makes the diagram generation process reproducible and keeps the architecture source of truth inside the repository.
# Individual Project Journal: s353422 Arion Samarxhiu

## Activity Log
| Date | Activity Description | Effort (Hours) | Related Report Section |
| :--- | :--- | :--- | :--- |
| [2026-05-12](#log-2026-05-12) | Gathering information regarding package/react-native folder | 1 | SoftwareDesign |
| [2026-05-16](#log-2026-05-16) | Primary analysis for design patterns | 2.5 | SoftwareDesign |


## Detailed Contributions
### <a id="log-2026-05-12"></a>[2026-05-12][Report SoftwareDesign]
**Specific Contribution:** Conducted comprehensive exploration of the React Native package structure, specifically targeting the `packages/react-native/` directory. Analyzed the internal architecture by mapping 13 distinct sub-modules and directories including core JavaScript logic (`Libraries`, `src`), build and tooling configurations (`scripts`, `gradle`), and platform-specific native directories (`ReactAndroid`, `ReactApple`, `ReactCommon`). Extracted structural integrity metrics and identified 14 internal JS/TS code dependencies across the codebase, laying the groundwork for dependency analysis documented in Section 1.2 and 1.3 of the Software Design report.

### <a id="log-2026-05-16"></a>[2026-05-16][Report SoftwareDesign]
**Specific Contribution:** Conducted primary analysis of design patterns utilized within the React Native codebase, identifying and documenting four key architectural patterns. Analyzed the Observer Pattern implementation in `Libraries/vendor/emitter/EventEmitter.js` for event-driven communication, the Registry Pattern in `AppRegistry.js` for component lifecycle management, the Factory Pattern in `Libraries/Animated/AnimatedImplementation.js` for flexible animation creation, and the Composite Pattern in `AnimatedWithChildren.js` for tree-based animation composition. For each pattern, documented the roles, rationale, and three alternative design approaches with detailed pros/cons analysis, contributing to Section 2 (Design Patterns) of the Software Design report.

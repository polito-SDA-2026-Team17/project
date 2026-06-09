# Individual Project Journal: s353422 Arion Samarxhiu

## Activity Log
| Date | Activity Description | Effort (Hours) | Related Report Section |
| :--- | :--- | :--- | :--- |
| [2026-05-12](#log-2026-05-12) | Gathering information regarding package/react-native folder | 1 | SoftwareDesign |
| [2026-05-16](#log-2026-05-16) | Primary analysis for design patterns | 2.5 | SoftwareDesign |
| [2026-05-28](#log-2026-05-28) |  Refactor & Format | 4.5 |  SoftwareDesign |
| [2026-06-08](#log-2026-06-08) | Summary of design findings | 3 | SoftwareDesign |


## Detailed Contributions
### <a id="log-2026-05-12"></a>[2026-05-12][Report SoftwareDesign]
**Specific Contribution:** Conducted comprehensive exploration of the React Native package structure, specifically targeting the `packages/react-native/` directory. Analyzed the internal architecture by mapping 13 distinct sub-modules and directories including core JavaScript logic (`Libraries`, `src`), build and tooling configurations (`scripts`, `gradle`), and platform-specific native directories (`ReactAndroid`, `ReactApple`, `ReactCommon`). Extracted structural integrity metrics and identified 14 internal JS/TS code dependencies across the codebase, laying the groundwork for dependency analysis documented in Section 1.2 and 1.3 of the Software Design report.

### <a id="log-2026-05-16"></a>[2026-05-16][Report SoftwareDesign]
**Specific Contribution:** Conducted primary analysis of design patterns utilized within the React Native codebase, identifying and documenting four key architectural patterns. Analyzed the Observer Pattern implementation in `Libraries/vendor/emitter/EventEmitter.js` for event-driven communication, the Registry Pattern in `AppRegistry.js` for component lifecycle management, the Factory Pattern in `Libraries/Animated/AnimatedImplementation.js` for flexible animation creation, and the Composite Pattern in `AnimatedWithChildren.js` for tree-based animation composition. For each pattern, documented the roles, rationale, and three alternative design approaches with detailed pros/cons analysis, contributing to Section 2 (Design Patterns) of the Software Design report.

### <a id="log-2026-05-28"></a>[2026-05-28][SoftwareDesign]
**Specific Contribution:** Due to the SoftwareDesign.md report being way above the maximum word count depicted a formating was required. Formatting a 3000+ character document
required selectivety.
    1. Because the Markdown syntax special characters would affect the output of the counting done with `tokei SoftwareDesign.md` (Please note that this counting was done before we were provided the official command), much of the bulletin, numbering and table syntaxes were altered. 
    2. Excess information was pruned.

This was done in collaboration with the student `Jon Kurmaku s339541` (name/surname/matricola).

### <a id="log-2026-06-08"></a>[2026-06-08][Report SoftwareDesign]
**Specific Contribution:** Worked on the summary of the Software Design report by synthesizing the findings from the dependency analysis and the design pattern analysis. Summarized what the dependency structures and pattern usages reveal about the overall software design quality, modularity, and maintainability of React Native.

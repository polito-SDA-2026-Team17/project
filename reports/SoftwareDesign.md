# Software Design Report
## 1. Dependencies

### 1.1 Software Modules
The analysis targets the internal architecture of the core React Native package (`packages/react-native/`), evaluating a total of 13 distinct sub-modules and directories. This includes core JavaScript logic (`Libraries`, `src`), build and tooling configurations (`scripts`, `gradle`), and platform-specific native directories (`ReactAndroid`, `ReactApple`, `ReactCommon`). Across these 13 modules, the structural integrity and coupling were assessed by mapping 14 internal JS/TS code dependencies and identifying 353 structural inconsistencies.

### 1.2 Methodology and Tools
To conduct a comprehensive dependency evaluation, a custom Node.js script (`analyze-dependencies.js`) was developed to extract both structural and historical metrics:
* **Code Dependencies (Static Analysis):** Structural dependencies were mapped by traversing all JavaScript and TypeScript source files (`.ts, .tsx, .js, .jsx`). The tool utilized regular expressions to extract static `import` and `require()` statements to identify internal cross-package dependencies.
* **Knowledge Dependencies (Co-change Analysis):** Logical coupling was evaluated by mining the Git version control history using the `git log` command to analyze the last 5,000 commits. The script calculated the frequency at which different packages and directories were modified together within the exact same commit.
* **Inconsistency Detection:** The script cross-referenced physical code imports against `package.json` declarations and Git co-change history to flag hidden coupling and undeclared dependencies.

### 1.3 Code Dependencies
*Evaluation of dependencies based on imports in the source code.*

**Code Dependencies Metrics Summary**

| Directory / Module | File Count | Outgoing Dependencies (Efferent) | Incoming Dependencies (Afferent) | Centrality Score |
| :--- | :--- | :--- | :--- | :--- |
| `Libraries` | 702 | 7 | 0 | 4.67 |
| `scripts` | 82 | 3 | 0 | 2.00 |
| `src` | 246 | 3 | 0 | 2.00 |
| `types` | 18 | 1 | 0 | 0.67 |
| `ReactAndroid`, `ReactApple`, `ReactCommon`, `gradle`, `flow` | Var. | 0 | 0 | 0.00 |

* **Highest Dependencies (Most efferent/afferent coupling):** * **Directories:** `Libraries` (7 Outgoing Dependencies, 702 files) and `scripts` (3 Outgoing Dependencies, 82 files).
  * **Reasoning:** The `Libraries` directory acts as the central hub and core repository for React Native's JavaScript components and APIs (yielding the highest Centrality score of 4.67). It is highly coupled because it acts as the orchestrator, pulling in utilities like `virtualized-lists`, `normalize-colors`, `fantom`, and `assets-registry` to construct the unified framework exposed to developers. 
* **Lowest Dependencies (Least coupling):** * **Directories:** `ReactAndroid`, `ReactApple`, `ReactCommon`, `gradle`, and `flow` (All register 0 Outgoing JS Dependencies).
  * **Reasoning:** These directories act as perfect "Leaf Nodes" in this specific analysis. Because they primarily contain native platform code (Java, Objective-C, C++) or build configurations rather than JavaScript/TypeScript source files, they do not participate in the JS module resolution tree. They represent the underlying native systems that the JS layer commands, rather than relying on JS utilities themselves.

### 1.4 Knowledge Dependencies
*Evaluation of dependencies based on co-change (how often two files/packages are changed together in the same Git commit).*

* **Analysis:** The co-change analysis of the Git history reveals massive logical coupling between the core `react-native` package and external monorepo tooling. The most frequent co-changes represent expected feature-evolution workflows spanning multiple system boundaries.

**Top Knowledge Dependencies & Hidden Coupling (Inconsistencies)**

| Package Pair | Co-change Frequency | Code Dependencies | Status |
| :--- | :--- | :--- | :--- |
| `react-native` ↔ `rn-tester` | 216 commits | 0 | Hidden Coupling |
| `react-native` ↔ `react-native-codegen` | 67 commits | 0 | Hidden Coupling |
| `react-native` ↔ `virtualized-lists` | 66 commits | 0 | Hidden Coupling |
| `react-native` ↔ `react-native-fantom` | 56 commits | 0 | Hidden Coupling |

* **Inconsistencies with Code Dependencies:** * **Identified Packages:** As shown in the table above, the most frequent co-changes lack direct structural code dependencies.
  * **Reasoning:** These inconsistencies represent "Hidden Coupling," where logical dependencies are driven by testing, architecture shifts, and feature parity rather than physical source code imports:
    * **Testing Synchronization:** The incredibly high co-change rate with `rn-tester` and `react-native-fantom` occurs because any update to a core UI component in `react-native` requires an immediate, parallel update to its corresponding test suite and internal testing applications to prevent CI pipeline failures.
    * **Code Generation:** `react-native-codegen` co-changes frequently with the core package because the New Architecture relies on generating C++ boilerplate from JS specifications. When a spec in the core framework changes, the code generator tooling must often be updated in tandem, creating strict logical coupling without direct file imports.

## 2. Patterns

*Assess pattern usage in the codebase. Ensure there are links to the actual code in the repository.*

### 2.1 Pattern Instance 1: [Name of Pattern, e.g., Singleton]
* **Link to Code:** `[Insert link to the file in your repository]`
* **Roles:** *Which classes/interfaces play which role in this pattern? (e.g., Class X acts as the Subject, Class Y acts as the Observer).*
* **Rationale:** *Why is this pattern used here? What specific problem does it solve in the system?*
* **Alternatives:** *What is an alternative way to solve this problem? Discuss the Pros and Cons of using that alternative instead of the current pattern.*

### 2.2 Pattern Instance 2: [Name of Pattern, e.g., Factory Method]
* **Link to Code:** `[Insert link to the file in your repository]`
* **Roles:** *Identify class roles.*
* **Rationale:** *Explain the problem it solves.*
* **Alternatives:** *Discuss alternative approaches and their Pros & Cons.*

### 2.3 Pattern Instance 3: [Name of Pattern, e.g., Observer]
* **Link to Code:** `[Insert link to the file in your repository]`
* **Roles:** *Identify class roles.*
* **Rationale:** *Explain the problem it solves.*
* **Alternatives:** *Discuss alternative approaches and their Pros & Cons.*

### 2.4 Pattern Instance 4: [Name of Pattern, e.g., Facade]
* **Link to Code:** `[Insert link to the file in your repository]`
* **Roles:** *Identify class roles.*
* **Rationale:** *Explain the problem it solves.*
* **Alternatives:** *Discuss alternative approaches and their Pros & Cons.*

---

## 3. Summary

*Provide a comprehensive summary of the findings from the two design aspects analyzed above. Synthesize what the dependency structures and pattern usages tell you about the overall software design quality, modularity, and maintainability of the system.*


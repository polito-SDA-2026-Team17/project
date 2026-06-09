# Individual Project Journal: 351728 Postoglu Dogukan

## Activity Log

| Date       | Activity Description                                                                 | Effort (Hours) | Related Report Section          |
| :--------- | :----------------------------------------------------------------------------------- | :------------- | :------------------------------ |
| 2026-05-01 | Conducting framework component research and investigating C4 architectural standards | 1.5            | Overview: Fundamental Knowledge |
| 2026-05-15 | Understanding the logic of the C4 System Context diagram and drafting it via Draw.io | 2.5            | Architecture: Context Diagram   |
| 2026-05-29 | Translating the visual context schema into code using Structurizr text-based tools   | 1.0            | Architecture: Context Diagram   |
| 2026-05-29 | Designing and coding the Level 2 Container Diagram using Structurizr DSL             | 2.0            | Architecture: Container Diagram |
| 2026-06-03 | Designing and coding the Level 3 Component Diagram using Structurizr DSL             | 2.5            | Architecture: Component Diagram |
| 2026-06-05 | Getting feedback from the professor about the architecture-related diagrams          | 2              | Architecture: Component Diagram |
| 2026-06-03 | Organizing meeting to fix the issues on diagrams based on professor's feedback       | 2              | Architecture: Component Diagram |

## Detailed Contributions

### 2026-05-01 [Overview: Fundamental Knowledge]

**Specific Contribution:** I started the project by researching how cross-platform mobile frameworks communicate with native operating systems. I focused on understanding how data moves between JavaScript and native engines. At the same time, I studied the basic rules of the C4 model to learn how to separate high-level system components from minor technical details.

### 2026-05-15 [Architecture: Context Diagram]

**Specific Contribution:** I drew the first version of our Level 1 System Context Diagram using Draw.io. In this step, I defined how mobile developers and end-users interact with the core framework. I also clearly showed the connections going from the framework to the underlying iOS and Android platforms, creating a clean visual guide for our project's structure.

### 2026-05-29 [Architecture: Context Diagram]

**Specific Contribution:** Following the course slides, specifically focusing on Page 24 which explains why text-based modeling can be better than visual tools, I updated our approach. To make our diagrams easier to maintain and version-control, I recreated the Level 1 System Context Diagram using Structurizr DSL code, moving our architecture from a static image to a dynamic code script.

### 2026-05-29 [Architecture: Container Diagram]

**Specific Contribution:** I created our Level 2 Container Diagram using Structurizr DSL and saved it as container_diagram_L2. I broke the system down into three main parts: the JavaScript Runtime, the C++ JSI Layer, and the Native App. I mapped out their technologies (C++, Java, Swift) and coded how they talk to each other to handle UI updates and background services. This gave us a clear view of how code moves between JavaScript and the phone's operating system.

### 2026-06-03 [Architecture: Component Diagram]

**Specific Contribution:** I created our Level 3 Component Diagram for the Shared C++ Runtime Core using Structurizr DSL and saved it as component_diagram_L3. I broke down the C++ layer into its core parts like the JSI Registry, Fabric Scheduler, and Shadow Tree. I coded how these components work together to process UI changes, talk to the Yoga layout engine, and send the final updates to the Android and Apple platforms.

### 2026-06-05 [Architecture: General Review]

**Specific Contribution:** I participated in our project evaluation meeting with Prof. Vetrò to review our C4 models. Based on his feedback, I noted down the exact fixes we need to make. Our main focus will be fixing mismatches between diagram layers, ensuring all incoming and outgoing connections (I/O arrows) match perfectly across levels, and writing strong explanations in the final report to justify why we drew our system boundaries the way we did.

### 2026-06-07 [Architecture: Component Diagram]

I held an online sync meeting with my teammates to fix the diagram issues pointed out during evaluation and align our Level 2 and Level 3 system boundaries. To make our technical analysis more complete, we agreed to add a new Level 3 Component Diagram. I took charge of planning how to open up the "JS Framework Layer" container to show its deep internal modules and code structure in the report.

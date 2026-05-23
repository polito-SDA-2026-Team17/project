# Software Architecture Report

## Recommended Workflow
To create and modify diagrams use this workflow:

1. Edit the DSL in `diagrams/workspace.dsl`.
2. Render the workspace in Structurizr (docker compose up).
3. Export the diagrams as PNG or SVG.
4. Save the exported files in `images/`.
5. Insert the images into the related sections.

## Purpose
This report documents the software architecture of React Native using a C4 model approach. 

## System Context Diagram

![System Context](../images/react-native-system-context.png)

The system context diagram shows React Native as the central software system. It interacts mainly two human actors and several external software systems.

## Container Diagram

![Container Diagram](../images/react-native-container.png)

The container diagram decomposes React Native into the main runtime containers involved in execution.

- JS Runtime Container: runs JavaScript code, manages application state, and computes the component tree.
- Native Host Container: coordinates the application lifecycle, UI main thread, layout engine integration, and communication with the underlying operating system.
- Android/iOS Platforms: represent the external native environments that ultimately render pixels on screen.

The interaction between the two containers is primarily mediated by JSI. The JS Runtime sends rendering instructions to the Native Host, while the Native Host can notify user events back to the runtime. The Native Host then delegates the final drawing request to the platform-native APIs.

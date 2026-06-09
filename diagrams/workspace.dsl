workspace "React Native Architecture" "Comprehensive C4 model for React Native including L3 components" {

    model {
        // ========================================================
        // --- L1: EXTERNAL SYSTEMS ---
        // ========================================================
        iosPlatform = softwareSystem "iOS Platform" "Native Apple operating system (UIKit, CoreAnimation, Cocoa Touch APIs)." "iOS"
        androidPlatform = softwareSystem "Android Platform" "Native Android operating system (Android SDK, OS Window Manager)." "Android"
        reactLibrary = softwareSystem "React" "Core library providing the component-driven model and state management paradigms." "React"
        javaScriptRuntime = softwareSystem "JS Runtime (Hermes)" "Embedded JS execution engine running bytecode directly on the device." "JSRuntime"
        yoga = softwareSystem "Yoga Layout Engine" "Cross-platform layout engine computing flexible geometry (Flexbox UI updates)." "Yoga"

        // ========================================================
        // --- L2 & L3: REACT NATIVE SYSTEM BOUNDARY ---
        // ========================================================
        reactNative = softwareSystem "React Native Framework" "Cross-platform mobile UI framework based on the New Architecture." {
            
            // --- CONTAINER: JS FRAMEWORK LAYER (Expanded to Level 3) ---
            jsLayer = container "JS Framework Layer" "Contains core npm packages (View, Text), developer-facing APIs, and the React tree builder." "JavaScript / TypeScript" {
                reactCore = component "React Core Library" "Provides declarative component models, hooks, and state management paradigms." "JavaScript"
                coreComponents = component "Core Components API" "Provides developer-facing UI primitives like View, Text, Image, and StyleSheet." "JavaScript"
                reactReconciler = component "React Reconciler" "Calculates state changes, executes the diffing algorithm, and generates the React element tree." "JavaScript"
                turboModuleBindings = component "TurboModule JS Bindings" "Exposes strictly-typed JavaScript interfaces mapped to underlying native modules." "TypeScript"
                jsiGateway = component "JSI Interop Gateway" "Acts as the single exit boundary, routing all JS requests to the underlying C++ runtime." "JavaScript"

                // --- L3 JS Framework Internal Relationships ---
                reactCore -> reactReconciler "Triggers render updates to" "[Method Call]"
                coreComponents -> reactReconciler "Feeds primitive node definitions to" "[Method Call]"
                reactReconciler -> jsiGateway "Forwards rendering trees to" "[Method Call]"
                turboModuleBindings -> jsiGateway "Forwards native method invocations to" "[Method Call]"
            }
            
            // --- CONTAINER: SHARED C++ RUNTIME CORE (Expanded to Level 3) ---
            cppCore = container "Shared C++ Runtime Core" "The core of the New Architecture. Manages JSI bindings, Fabric's Shadow Tree, and synchronous operations." "C++" {
                jsiBindings = component "JSI Engine Bridge" "Exposes C++ Host Objects and handles low-level data mapping with the JS engine runtime." "C++ (facebook::jsi)"
                fabricScheduler = component "Fabric Scheduler" "Orchestrates UI commits, coordinates runtime threads, and prioritizes layout rendering work." "C++ (react::renderer::Scheduler)"
                shadowTreeManager = component "Shadow Tree Manager" "Manages immutable trees of C++ ShadowNodes representing the layout geometry." "C++ (react::renderer::ShadowTree)"
                turboModuleManager = component "TurboModules Engine" "Provides a registry and synchronous execution path for strongly-typed native modules." "C++"
                mountingCoordinator = component "Mounting Coordinator" "Computes differences between shadow trees and generates layout mutation lists." "C++ (react::renderer::MountingCoordinator)"

                // --- L3 C++ Core Internal Relationships ---
                jsiBindings -> fabricScheduler "Forwards UI rendering requests to" "method call"
                jsiBindings -> turboModuleManager "Routes synchronous native module invocations to" "method call"
                fabricScheduler -> shadowTreeManager "Schedules tree updates and commits on" "method call"
                shadowTreeManager -> mountingCoordinator "Supplies calculated layout transactions to" "method call"
            }
            
            // --- CONTAINERS: PLATFORM WRAPPERS ---
            androidWrapper = container "React Android Adapter" "Initializes the native Android instance, hosts Java ViewManagers, and handles JNI communications." "Java / C++ (JNI)"
            appleWrapper = container "React Apple Adapter" "Initializes the native iOS instance, manages UIView lifecycles, and hosts component mounting." "Objective-C++ / Swift"

            // --- Inner Container-to-Container Boundaries (L2 Level) ---
            jsLayer -> cppCore "Invokes native methods and dispatches rendering trees synchronously via" "JSI"
            jsLayer -> reactLibrary "Uses the declarative component model and state management from"
            cppCore -> androidWrapper "Dispatches layout mutation lists for native mounting via" "JNI"
            cppCore -> appleWrapper "Dispatches layout mutation lists for native mounting via" "C++ Pointers"
            
            // --- Cross-Boundary Component-to-Component Connections (L3 Blueprint) ---
            jsiGateway -> jsiBindings "Dispatches operations and rendering trees synchronously via" "[JSI]"
        }

        // ========================================================
        // --- SYSTEM EXTERNAL RELATIONSHIPS (L1 / L2 Context) ---
        // ========================================================
        androidWrapper -> androidPlatform "Initializes and renders native views using" "Android SDK"
        appleWrapper -> iosPlatform "Initializes and renders native UIViews using" "UIKit"
        
        jsiBindings -> javaScriptRuntime "Interacts with the engine lifecycle and injects C++ Host Objects into" "JSI"
        shadowTreeManager -> yoga "Delegates the flexbox layout computational rendering of nodes to" "C++ Static Linking"
        
        mountingCoordinator -> androidWrapper "Pushes Java-specific Mutation Lists for UI rendering via" "JNI"
        mountingCoordinator -> appleWrapper "Pushes Objective-C++ Component View mutations via" "C++ Pointers"
    }

    views {
        systemContext reactNative "SystemContext" {
            include *
            autolayout lr
        }

        container reactNative "Containers" {
            include *
            autolayout tb
        }

        component jsLayer "JS_Framework_Components" {
            include *
            autolayout tb
        }

        component cppCore "CPP_Core_Components" {
            include *
            autolayout tb
        }

        theme default
        
        styles {
            element "iOS" {
                background #7c7c7c 
            }
            element "Android" {
                background #7c7c7c
            }
            element "React" {
                background #7c7c7c 
            }
            element "JSRuntime" {
                background #7c7c7c
            }
            element "Yoga" {
                background #7c7c7c
            }
        }
    }
}
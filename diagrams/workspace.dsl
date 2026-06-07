workspace "React Native Architecture" "C4 model for React Native" {

    model {
        // ==========================================
        // --- L1: ACTORS & EXTERNAL SYSTEMS ---
        // ==========================================
        iosPlatform = softwareSystem "iOS Platform" "Native Apple operating system (UIKit, CoreAnimation, Cocoa Touch APIs)." "iOS"
        androidPlatform = softwareSystem "Android Platform" "Native Android operating system (Android SDK, OS Window Manager)." "Android"
        reactLibrary = softwareSystem "React" "Core library providing the component-driven model and state management paradigms." "React"
        javaScriptRuntime = softwareSystem "JS Runtime (Hermes)" "Embedded JS execution engine running bytecode directly on the device." "JSRuntime"
        yoga = softwareSystem "Yoga Layout Engine" "Cross-platform layout engine computing flexible geometry (Flexbox UI updates)." "Yoga"

        // ==========================================
        // --- L2: REACT NATIVE SYSTEM ---
        // ==========================================
        reactNative = softwareSystem "React Native Framework" "Cross-platform mobile UI framework based on the New Architecture." {
            
            // RUNTIME JAVASCRIPT LAYER
            jsLayer = container "JS Framework Layer" "Contains core npm packages (View, Text), developer-facing APIs, and the React tree builder." "JavaScript / TypeScript"
            
            // RUNTIME CORE C++ (L3 Target)
            cppCore = container "Shared C++ Runtime Core" "The core of the New Architecture. Manages JSI bindings, Fabric's Shadow Tree, and synchronous operations." "C++" {
                
                jsiBindings = component "JSI Engine Bridge" "Exposes C++ Host Objects and handles low-level data mapping with the JS engine runtime." "C++ (facebook::jsi)"
                fabricScheduler = component "Fabric Scheduler" "Orchestrates UI commits, coordinates runtime threads, and prioritizes layout rendering work." "C++ (react::renderer::Scheduler)"
                shadowTreeManager = component "Shadow Tree Manager" "Manages immutable trees of C++ ShadowNodes representing the layout geometry." "C++ (react::renderer::ShadowTree)"
                turboModuleManager = component "TurboModules Engine" "Provides a registry and synchronous execution path for strongly-typed native modules." "C++"
                mountingCoordinator = component "Mounting Coordinator" "Computes differences between shadow trees and generates layout mutation lists." "C++ (react::renderer::MountingCoordinator)"

                // --- L3 Internal Component Relationships ---
                jsiBindings -> fabricScheduler "Forwards UI rendering requests to" "method call"
                jsiBindings -> turboModuleManager "Routes synchronous native module invocations to" "method call"
                fabricScheduler -> shadowTreeManager "Schedules tree updates and commits on" "method call"
                shadowTreeManager -> mountingCoordinator "Supplies calculated layout transactions to" "method call"
            }
            
            // PLATFORM WRAPPERS
            androidWrapper = container "React Android Adapter" "Initializes the native Android instance, hosts Java ViewManagers, and handles JNI communications." "Java / C++ (JNI)"
            appleWrapper = container "React Apple Adapter" "Initializes the native iOS instance, manages UIView lifecycles, and hosts component mounting." "Objective-C++ / Swift"

            // --- Inner Container Relationships ---
            jsLayer -> jsiBindings "Invokes native methods and dispatches rendering trees synchronously via" "JSI"
            jsLayer -> reactLibrary "Uses the declarative component model and state management from"
            cppCore -> androidWrapper "Dispatches layout mutation lists for native mounting via" "JNI"
            cppCore -> appleWrapper "Dispatches layout mutation lists for native mounting via" "C++ Pointers"
        }

        // ==========================================
        // --- CONTEXT RELATIONSHIPS (L1 / L2 EXTERNAL) ---
        // ==========================================
        androidWrapper -> androidPlatform "Initializes and renders native views using" "Android SDK"
        appleWrapper -> iosPlatform "Initializes and renders native UIViews using" "UIKit"
        
        jsiBindings -> javaScriptRuntime "Interacts with the engine lifecycle and injects C++ Host Objects into" "JSI"
        shadowTreeManager -> yoga "Delegates the flexbox layout computational rendering of nodes to" "C++ Static Linking"
        
        mountingCoordinator -> androidWrapper "Pushes Java-specific Mutation Lists for UI rendering via" "JNI"
        mountingCoordinator -> appleWrapper "Pushes Objective-C++ Component View mutations via" "C++ Pointers"
    }

    views {
        systemContext reactNative {
            include *
        }

        container reactNative {
            include *
        }

        component cppCore {
            include *
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
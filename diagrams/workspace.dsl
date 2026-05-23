workspace "React Native Architecture" "C4 model for React Native" {
    model {
        endUser = person "End User" "Uses mobile apps built with React Native"
        mobileAppDeveloper = person "Mobile App Developer" "Builds mobile apps using React Native"

        iosPlatform = softwareSystem "iOS Platform" "Native iOS operating system and APIs"
        androidPlatform = softwareSystem "Android Platform" "Native Android operating system and APIs"
        reactLibrary = softwareSystem "React" "Provides the core component model and state management used by React Native"
        dependencyManager = softwareSystem "Dependency Manager" "Used to resolve and install the libraries required for the framework and apps to build successfully"

        reactNative = softwareSystem "React Native" "Cross-platform mobile UI framework. Allows developers to build native applications with React, provides access to platform APIs, and bridges JavaScript logic with native components" {
            jsRuntime = container "JS Runtime" "Executes business logic, manages state, and calculates the component tree" {
                technology "JavaScript, Hermes"
            }
            nativeHost = container "Native Host Container" "Manages lifecycle, the UI main thread, layout, and native delegation" {
                technology "C++, Java/Kotlin, Swift/Obj-C"
            }

            jsRuntime -> nativeHost "Send rendering instructions" "JSI (synchronous, C++ objects)"
            nativeHost -> jsRuntime "Notify user events" "JSI (asynchronous, event loop)"
            nativeHost -> iosPlatform "Request physical pixel drawing on screen" "Platform native API"
            nativeHost -> androidPlatform "Request physical pixel drawing on screen" "Platform native API"
        }

        endUser -> reactNative "Uses mobile apps built with"
        mobileAppDeveloper -> reactNative "Builds apps using"

        reactNative -> iosPlatform "Invokes iOS APIs"
        reactNative -> androidPlatform "Invokes Android APIs"
        reactNative -> reactLibrary "Uses declarative UI patterns and shared APIs from"
        reactNative -> dependencyManager "Resolves and installs project dependencies for"
    }

    views {
        systemContext reactNative {
            include *
        }

        container reactNative {
            include *
        }

        theme default
    }
}
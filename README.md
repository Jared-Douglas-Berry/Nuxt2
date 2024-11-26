# Nuxt2

# List of Changes and Reasons:

# 1. IssueEditLabel.vue
1. Gettext Function:

    1.1. Lines Changed: 4, 14 Reason: Updated the $localeString function to $t, which is more commonly used as a shorthand for the i18n translation function in Vue 3
2. @click.native:

    2.1. Lines Changed: 15, 17 Reason: Removed .native modifier. In Vue 3, @click.native is not necessary like in Vue 2. Event handlers are directly bound to the component methods.
3. Import computed from vue:

    3.1. Lines Changed: 23 Reason: Vue 3 uses vue as the main package and computed is now part of the reactivity system.
4. Reactive Access Changes:

    4.1. Lines Changed: 29-33 Reason: Used computed for filteredLabelOptions to represent better reactivity in Vue 3. computed is used here to automatically recompute when dependencies (labelOptions) change.
5. Summary of Changes:

    5.1. Vue Composition API Usage: Updated to use direct Vue 3 setup syntax.

    5.2. Event Handling: Removed unnecessary .native modifier.

    5.3. Reactive Data Handling: Used computed for reactive computed properties.

# 2. SelectInput.vue
1. Defining the emit event:

    1.1. Changed Line: 26 Reason: The defineEmits function is updated to emit update:modalValue.

    1.2. Changed Line: 26 Reason: The defineEmits function is used to define the emitted events in the latest Vue 3 format, allowing for better clarity and type-checking capabilities.
2. Emitting the update:modalValue event:

    2.1. Changed Lines: 56, 62 Reason: Changed the emitted event from input to update:modalValue to reflect the new event name.
3. Import from vue instead of @nuxtjs/composition-api:

    3.1. Changed Line: 24 Reason: Vue 3 uses vue as the main package for the Composition API, unlike @nuxtjs/composition-api. This ensures compatibility with Vue 3.
4. Function Definition Standardization:

    4.1. Changed Line: 48 Reason: Standardized the function definition for better readability and consistency with Vue 3 practices.
5. Computed Properties:

    5.1. Changed Lines: 52-69 Reason: These computed properties are updated using Vue 3's computed function to ensure proper reactivity and to align with the latest Composition API practices.
6. Computed Property for valueNotInOptions:

    6.1. Changed Lines: 71-79 Reason: The valueNotInOptions logic is encapsulated within a computed property using Vue 3's computed for better reactivity and alignment with Vue 3 standards.
7. Summary of Changes:

    7.1. Vue Composition API Usage: Updated to use direct Vue 3 syntax.

    7.2. Clean Imports: Imported necessary functions directly from vue.

    7.3. Event Handling: Ensured event emission with emit as update:modalValue.

    7.4. Reactive Data Handling: Used computed for properties to maintain reactivity and to follow the latest Vue 3 conventions.

    7.5. Function Standardization: Ensured function definitions follow standard and readable patterns.

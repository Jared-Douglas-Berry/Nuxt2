<template>
  <div>
    <div class="group relative">
      <select
        v-model="selectedOption"
        class="h-12 w-full cursor-pointer appearance-none rounded-xl border border-transparent bg-slate-100 px-6 text-sm text-slate-900 outline-0 ring-slate-100 ring-offset-0 transition-all placeholder:text-slate-400 focus:border-slate-200 focus:bg-white focus:ring disabled:cursor-not-allowed disabled:text-slate-500"
        :class="{
          'pl-4 lg:pl-6': smallPadding,
          'px-6': !smallPadding,
        }"
        :required="required"
        :disabled="disabled"
      >
        <option value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-if="valueNotInOptions && allowValueNotInOptions"
          :value="value"
          selected
        >
          {{ value }}
        </option>
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value ? option.value : option"
          :selected="isSelected(option)"
          :disabled="option.disabled"
        >
          {{ option.name ? option.name : option }}
        </option>
      </select>
      <IconSelect
        class="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500 transition-all group-hover:text-slate-900"
      />
    </div>
    <div
      v-if="valueNotInOptions && allowValueNotInOptions"
      class="mt-2 text-xs text-gray-400"
    >
      <span
        >The original value is not listed in the list of viable options. Please
        be aware that changing the option will result in the loss of the
        original value.</span
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "@nuxtjs/composition-api";
const emit = defineEmits(["input"]);

const props = defineProps({
  value: {
    type: [String, Object, Number],
    required: false,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "-",
  },
  options: {
    type: Array,
    required: true,
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  smallPadding: {
    type: Boolean,
    required: false,
    default: false,
  },
  allowValueNotInOptions: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  returnObject: {
    type: Boolean,
    required: false,
    default: false,
  },
});

function isSelected(option) {
  return option.value
    ? option.value?.toString() === props.value?.toString()
    : option?.toString() === props.value?.toString();
}

const selectedOption = computed({
  get() {
    if (props.returnObject) {
      return props.value;
    }

    const value =
      typeof props.value === "object" && props.value
        ? props.value.id
        : props.value;
    return value || "";
  },
  set(value) {
    if (props.returnObject) {
      emit("input", value);
    } else {
      const valueToEmit = typeof value === "object" && value ? value.id : value;
      emit("input", valueToEmit);
    }
  },
});

const valueNotInOptions = computed(() => {
  return (
    props.value &&
    !props.options.some((option) => {
      return option.value
        ? option.value?.toString() === props.value?.toString()
        : option?.toString() === props.value?.toString();
    })
  );
});
</script>

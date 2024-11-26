<template>
  <div class="w-full max-w-xl">
    <ModalHeader>
      {{ $localeString('issues.editTodo', 'editIssue') }}
    </ModalHeader>
    <ModalContent>
      <SelectInput v-model="label" :options="filteredLabelOptions" />
    </ModalContent>
    <ModalFooter>
      <BaseButton
        :text="$localeString('global.cancel', 'cancel')"
        :large="true"
        @click.native="modalStore.closeModal()"
      />
      <BaseButton :text="$localeString('global.save', 'save')" :large="true" :primary="true" @click.native="save" />
    </ModalFooter>
  </div>
</template>

<script setup>
import { ref } from '@nuxtjs/composition-api'
import { useIssueStore } from '@/stores/IssueStore'
import { useModalStore } from '@/stores/ModalStore'
import { useOverviewIssue } from '@/composables/useOverviewIssue'

const issueStore = useIssueStore()
const modalStore = useModalStore()
const label = ref(issueStore?.issue?.label)
const { labelOptions } = useOverviewIssue()

const filteredLabelOptions = labelOptions.value?.filter(
  (option) => option?.type?.includes(modalStore.modalMessage.type) || labelOptions.value
)

function save() {
  const payload = {
    label: label.value,
  }
  issueStore.updateIssue(payload)
  modalStore.closeModal()
}
</script>

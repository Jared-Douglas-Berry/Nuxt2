<template>
  <div class="w-full max-w-xl">
    <ModalHeader>
      {{ $t('issues.editTodo', 'editIssue') }}
    </ModalHeader>
    <ModalContent>
      <SelectInput v-model="label" :options="filteredLabelOptions" />
    </ModalContent>
    <ModalFooter>
      <BaseButton
        :text="$t('global.cancel', 'cancel')"
        :large="true"
        @click="modalStore.closeModal()"
      />
      <BaseButton :text="$t('global.save', 'save')" :large="true" :primary="true" @click="save" />
    </ModalFooter>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useIssueStore} from '@/stores/IssueStore'
import {useModalStore} from '@/stores/ModalStore'
import {useOverviewIssue} from '@/composables/useOverviewIssue'

const issueStore = useIssueStore()
const modalStore = useModalStore()
const label = ref(issueStore?.issue?.label)
const {labelOptions} = useOverviewIssue()

const filteredLabelOptions = computed(() =>
  labelOptions.value?.filter(
    (option) => option?.type?.includes(modalStore.modalMessage.type) || labelOptions.value
  )
)

function save() {
  const payload = {
    label: label.value,
  }
  issueStore.updateIssue(payload)
  modalStore.closeModal()
}
</script>
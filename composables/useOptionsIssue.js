import { computed, useContext } from '@nuxtjs/composition-api'

export function useOptionsIssue() {
  const { $localeString } = useContext()

  const filterOptions = computed(() => [
    {
      key: 'user',
      localeString: 'issues.employee',
      labelPath: 'name',
    },
    {
      key: 'owner',
      localeString: 'issues.owner',
      labelPath: 'name',
    },
    {
      key: 'created',
      localeString: 'issues.created',
    },
    {
      key: 'searchInput',
      localeString: 'global2.search',
    },
  ])

  const statusOptions = computed(() => [
    {
      value: 'open',
      name: $localeString('issues.open', 'open'),
    },
    {
      value: 'todo',
      name: $localeString('issues.todo', 'todo'),
    },
    {
      value: 'in_progress',
      name: $localeString('issues.inProgress', 'in progress'),
    },
    {
      value: 'on_hold',
      name: $localeString('issues.onHold', 'on hold'),
    },
    {
      value: 'done',
      name: $localeString('issues.done', 'done'),
    },
    {
      value: 'executed',
      name: $localeString('issues.executed', 'executed'),
    },
  ])

  return { filterOptions, statusOptions }
}

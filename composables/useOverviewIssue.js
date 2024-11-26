import { computed, useContext } from '@nuxtjs/composition-api'
import { useUserStore } from '@/stores/UserStore'
import { useModalStore } from '@/stores/ModalStore'
import { useStringifyableFunction } from '@/composables/useStringifyableFunction'

export function useOverviewIssue() {
  const { $localeString } = useContext()
  const userStore = useUserStore()
  const permissions = userStore.permissions
  const modalStore = useModalStore()
  const { getStringifyableFunction } = useStringifyableFunction()

  const filterOptions = computed(() => [
    {
      key: 'location',
      localeString: $localeString('issues.location', 'issues.location'),
      labelPath: 'name',
    },
    {
      key: 'bicycle',
      localeString: $localeString('issues.bicycle', 'issues.bicycle'),
      labelPath: 'name',
    },
    {
      key: 'car',
      localeString: $localeString('issues.car', 'issues.car'),
      labelPath: 'licensePlate',
    },
  ])

  const columnOptions = computed(() => [
    {
      key: 'type',
      localeString: 'type',
      size: 1,
      path: 'type',
      type: 'icon',
      default: true,
    },
    {
      key: 'identifier',
      localeString: 'issues.identifier',
      size: 4,
      path: null,
      mapper: getStringifyableFunction('getIdentifier'),
      type: 'text',
      default: true,
    },
    {
      key: 'name',
      size: 2,
      path: 'name',
      localeString: 'global.name',
      type: 'text',
      default: true,
    },
    {
      key: 'assignedTo',
      localeString: 'issues.assignedTo',
      size: 2,
      mapper: getStringifyableFunction('issueAssignedToMapper'),
      type: 'text',
    },
    {
      key: 'createdAt',
      localeString: 'global.created',
      size: 2,
      path: 'createdAt',
      type: 'date',
      default: true,
    },
    {
      key: 'createdByUser',
      localeString: 'global.createdByUser',
      size: 2,
      path: 'createdByUser.name',
      type: 'text',
    },
    {
      key: 'updatedAt',
      localeString: 'global2.updated',
      size: 2,
      path: 'updatedAt',
      type: 'date',
    },
    {
      key: 'deadline',
      localeString: 'issues.deadline',
      size: 2,
      path: 'todo.deadline',
      type: 'date',
    },
    {
      key: 'status',
      localeString: 'global.status',
      size: 2,
      path: 'status',
      type: 'component',
      component: 'Status',
    },
    {
      key: 'label',
      localeString: 'global.label',
      size: 2,
      path: 'label',
      type: 'component',
      component: 'IssueLabel',
    },
    {
      key: 'remark',
      localeString: 'issues.remark',
      size: 2,
      path: 'remark',
      type: 'text',
    },
  ])

  const typeFilterOptions = computed(() => {
    const all = { name: $localeString('issues.all', 'all'), value: null }

    const location = {
      name: $localeString('issues.location', 'location'),
      value: 'location',
    }

    const car = {
      name: $localeString('issues.car', 'car'),
      value: 'car',
    }

    const bicycle = {
      name: $localeString('issues.bicycle', 'bicycle'),
      value: 'bicycle',
    }

    const typeFilters = []

    if (permissions.accessLocationIssues) {
      typeFilters.push(location)
    }

    if (permissions.accessCarIssues) {
      typeFilters.push(car)
    }

    if (permissions.accessBicycleIssues) {
      typeFilters.push(bicycle)
    }

    if (permissions.accessLocationIssues && permissions.accessCarIssues && permissions.accessBicycleIssues) {
      return [all, ...typeFilters]
    }

    return typeFilters
  })

  const sortingOptions = computed(() => [
    {
      name: $localeString('issues.name', 'Naam'),
      attribute: 'name',
      direction: 'asc',
      selected: false,
    },
    {
      name: $localeString('issues.name', 'Naam'),
      attribute: 'name',
      direction: 'desc',
      selected: false,
    },
    {
      name: $localeString('issues.created', 'Toegevoegd op'),
      attribute: 'id',
      direction: 'asc',
      selected: false,
    },
    {
      name: $localeString('issues.created', 'Toegevoegd op'),
      attribute: 'id',
      direction: 'desc',
      selected: true,
    },
    {
      name: $localeString('issues.sortUpdated', 'Aangepast op'),
      attribute: 'updatedAt',
      direction: 'asc',
      selected: false,
    },
    {
      name: $localeString('issues.sortUpdated', 'Aangepast op'),
      attribute: 'updatedAt',
      direction: 'desc',
      selected: false,
    },
    {
      name: $localeString('issues.deadline', 'Deadline op'),
      attribute: 'todo.deadline',
      direction: 'asc',
      selected: false,
    },
    {
      name: $localeString('issues.deadline', 'Deadline op'),
      attribute: 'todo.deadline',
      direction: 'desc',
      selected: false,
    },
  ])

  const tabs = computed(() => [
    {
      name: $localeString('issues.my', 'issues.my'),
      path: '/issues/my',
      allowed: permissions.accessMyIssues,
    },
    {
      name: $localeString('issues.all', 'issues.all'),
      path: '/issues/all',
      allowed: permissions.accessAllIssues,
    },
    {
      name: $localeString('issues.todo', 'issues.todo'),
      path: '/issues/todo',
      allowed: permissions.accessTodoIssues,
    },
    {
      name: $localeString('issues.onHold', 'issues.onHold'),
      path: '/issues/onhold',
      allowed: permissions.accessOnHoldIssues,
    },
    {
      name: $localeString('issues.finished', 'issues.finished'),
      path: '/issues/finished',
      allowed: permissions.accessFinishedIssues,
    },
  ])

  const labelOptions = computed(() => [
    {
      name: $localeString('issues.malfunctions', 'malfunctions'),
      value: 'malfunctions',
      type: ['location'],
    },
    {
      name: $localeString('issues.damages', 'damages'),
      value: 'damages',
      type: ['location'],
    },
    {
      name: $localeString('issues.inventory', 'inventory'),
      value: 'inventory',
      type: ['location', 'car'],
    },
    {
      name: $localeString('issues.snf', 'snf'),
      value: 'snf',
      type: ['location'],
    },
    {
      name: $localeString('issues.wastage', 'wastage'),
      value: 'wastage',
      type: ['location'],
    },
    {
      name: $localeString('issues.hygiene', 'hygiene'),
      value: 'hygiene',
      type: ['location', 'car', 'bicycle'],
    },
    {
      name: $localeString('issues.rush', 'rush'),
      value: 'rush',
      type: ['location'],
    },
    {
      name: $localeString('issues.order', 'order'),
      value: 'order',
      type: ['location', 'bicycle', 'car'],
    },
    {
      name: $localeString('issues.check', 'check'),
      value: 'check',
      type: ['location'],
    },
    {
      name: $localeString('issues.admin', 'admin'),
      value: 'admin',
      type: ['location', 'bicycle', 'car'],
    },
    {
      name: $localeString('issues.cleaning', 'cleaning'),
      value: 'cleaning',
      type: ['location'],
    },
    {
      name: $localeString('issues.other', 'other'),
      value: 'other',
      type: ['location', 'bicycle', 'car'],
    },
    {
      name: $localeString('issues.scratch', 'scratch'),
      value: 'scratch',
      type: ['bicycle', 'car'],
    },
    {
      name: $localeString('issues.stoneChips', 'stone chips'),
      value: 'stone_chips',
      type: ['bicycle', 'car'],
    },
    {
      name: $localeString('issues.windshieldDamage', 'windshield damage'),
      value: 'windshield_damage',
      type: ['car'],
    },
    {
      name: $localeString('issues.dent', 'dent'),
      value: 'dent',
      type: ['car', 'bicycle'],
    },
    {
      name: $localeString('issues.bumperDamage', 'bumper damage'),
      value: 'bumper_damage',
      type: ['car'],
    },
    {
      name: $localeString('issues.headlightDamage', 'headlight damage'),
      value: 'headlight_damage',
      type: ['car', 'bicycle'],
    },
    {
      name: $localeString('issues.maintenance', 'maintenance'),
      value: 'maintenance',
      type: ['car', 'bicycle'],
    },
    {
      name: $localeString('issues.mirrorDamage', 'mirror_damage'),
      value: 'mirror_damage',
      type: ['car'],
    },
    {
      name: $localeString('dashboardingIssues.noLabel', 'no label'),
      value: 'null',
    },
  ])

  const actionItems = computed(() => [
    {
      icon: 'AddSquare',
      name: $localeString('issues.createLocationIssue', 'create location issue'),
      allowed: permissions.createLocationIssue,
      callback: () => {
        modalStore.openModal('IssueCreate', { type: 'location' })
      },
    },
    {
      icon: 'AddSquare',
      name: $localeString('issues.createCarIssue', 'create car issue'),
      allowed: permissions.createCarIssue,
      callback: () => {
        modalStore.openModal('IssueCreate', { type: 'car' })
      },
    },
    {
      icon: 'AddSquare',
      name: $localeString('issues.createBicycleIssue', 'create bicycle issue'),
      allowed: permissions.createBicycleIssue,
      callback: () => {
        modalStore.openModal('IssueCreate', { type: 'bicycle' })
      },
    },
  ])

  return { columnOptions, sortingOptions, tabs, typeFilterOptions, labelOptions, filterOptions, actionItems }
}

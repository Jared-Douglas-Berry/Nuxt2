import 'pinia-plugin-persistedstate-2'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import cloneDeep from 'lodash/cloneDeep'

import { defineStore } from 'pinia'
import { computed, ref, useContext, watch } from '@nuxtjs/composition-api'
import { useImageWrapper } from '@/composables/useImageWrapper'

const qs = require('qs')
const populate = [
  'todo',
  'todo.users',
  'todo.user',
  'todo.resolvedImages',
  'todo.resolvedBy',
  'articles',
  'images',
  'room',
  'room.location',
  'room.location.address',
  'room.location.team',
  'createdByUser',
  'resolvedImages',
  'resolvedBy',
  'logs',
  'car',
  'car.address',
  'car.team',
  'bicycle',
  'bicycle.address',
  'bicycle.team',
]

const EMPTY_FILTER = {
  searchInput: '',
  sorting: 'created:desc',
  user: '',
  createdByUser: '',
  deadline: '',
  created: '',
  finished: '',
  status: '',
  label: '',
  team: '',
}

const emptyForm = {
  issue: {
    created: new Date().toISOString().substring(0, 10),
    room: null,
    roomLocation: null,
    status: 'open',
    images: [],
    label: '',
    type: '',
    car: null,
    bicycle: null,
  },
  // users: [],
}

export const useIssueStore = defineStore(
  'IssueStore',
  () => {
    const { $localeString, $strapi } = useContext()

    const issues = ref([])
    const loader = ref(null)
    const loading = ref(false)
    const view = ref('listView')
    const activeTab = ref('')
    const selectedIssues = ref([])
    const selectedColumns = ref([])
    const actionsWizardActive = ref(false)
    const page = ref(0)
    const totalIssues = ref(0)
    const detailTab = ref('specifications')
    const defaultFilters = ref([])
    const issueFilter = ref(cloneDeep(EMPTY_FILTER))
    const typeFilter = ref(null)

    const issue = ref(null)
    const form = ref(cloneDeep(emptyForm))

    function resetFilter() {
      issueFilter.value = cloneDeep(EMPTY_FILTER)
    }

    function clearForm() {
      form.value = cloneDeep(emptyForm)
    }

    function resetLoader() {
      issues.value = []
      loader.value?.reset()
      page.value = 0
    }

    function validateIssueForm() {
      const validations = []

      if (isEmpty(form.value.issue.name)) {
        validations.push({
          name: $localeString('global.name', 'Name'),
        })
      }

      if (form.value.issue.type === 'location') {
        if (!form.value.issue.roomLocation || form.value.issue.roomLocation === '') {
          validations.push({
            name: $localeString('global.location', 'Location'),
          })
        }

        if (!form.value.issue.room || form.value.issue.room === '') {
          validations.push({
            name: $localeString('global.room', 'Room'),
          })
        }
      }
      if (form.value.issue.type === 'car') {
        if (!form.value.issue.car || form.value.issue.car === '') {
          validations.push({
            name: $localeString('global.car', 'car'),
          })
        }
      }
      if (form.value.issue.type === 'bicycle') {
        if (!form.value.issue.bicycle || form.value.issue.bicycle === '') {
          validations.push({
            name: $localeString('global.bicycle', 'bicycle'),
          })
        }
      }
      return validations
    }

    async function findIssues(currentPage, loadMore = false) {
      if (!loadMore) issues.value = []
      const params = {
        pagination: { page: currentPage },
        populate,
        ...query.value,
      }

      try {
        const { data, meta } = await $strapi.find('issues', qs.stringify(params))

        totalIssues.value = meta.pagination.total
        if (loadMore) {
          issues.value = [...issues.value, ...data]
        } else {
          issues.value = data
        }
        return data.length
      } catch (error) {
        console.error(error)
      }
    }

    async function findIssue(id) {
      try {
        const { data } = await $strapi.findOne('issues', id, {
          populate: [...populate, 'todo.logs'],
        })
        issue.value = data
      } catch (error) {
        console.error(error)
      }
    }

    async function findAll() {
      loading.value = true

      issues.value = []
      const retrieveAmount = 250

      try {
        // set to retrieve at least once
        totalIssues.value = 1
        for (let i = 1; (i - 1) * retrieveAmount < totalIssues.value; i++) {
          query.value.pagination = {
            page: i,
            pageSize: retrieveAmount,
          }
          query.value.populate = [
            'room',
            'room.location',
            'room.location.address',
            'car',
            'car.address',
            'bicycle',
            'bicycle.address',
          ]
          const { data, meta } = await $strapi.find('issues', qs.stringify(query.value))
          issues.value = [...issues.value, ...data]
          totalIssues.value = meta.pagination.total
        }
      } catch (error) {
        console.error(error)
      }

      loading.value = false
    }

    async function updateIssue(payload) {
      try {
        const request = new FormData()

        if (payload?.resolvedImages) {
          const images = await useImageWrapper().unwrapImages(payload?.resolvedImages)

          if (images.length) {
            images.forEach((image) => request.append('files.resolvedImages', image))
          }
        }

        request.append('data', JSON.stringify(omit(payload, ['resolvedImages'])))

        const q = qs.stringify({
          populate: [...populate, 'todo.logs'],
        })

        const { data } = await $strapi.$http.$put(`/issues/${this.issue.id}?${q}`, request)

        await findIssue(data.id)
      } catch (error) {
        console.log(error)
      }
    }

    async function createIssue() {
      const validations = validateIssueForm()

      if (validations.length !== 0) {
        return validations
      } else {
        try {
          const request = new FormData()

          const images = await useImageWrapper().unwrapImages(form.value.issue.images)

          request.append('data', JSON.stringify(omit(form.value.issue, ['images'])))

          if (images.length) {
            images.map((image) => request.append('files.images', image))
          }

          await $strapi.create('issues', request)
          resetLoader()
        } catch (error) {
          console.log(error)
        }
      }
    }

    async function deleteIssue(id) {
      try {
        await $strapi.delete('issues', id)
        return true
      } catch (error) {
        console.error(error)
      }
    }

    async function createTodo(id) {
      try {
        const data = await $strapi.$http.$post(`/issues/${id}/create-todo`, {})
        return data
      } catch (error) {
        console.error(error)
      }
    }

    async function createTodos(data) {
      try {
        const result = await $strapi.$http.$post(`/issues/bulk-todo-create`, {
          data: { ids: selectedIssues.value, data },
        })

        selectedIssues.value = []
        if (view.value === 'listView') {
          resetLoader()
        } else if (view.value === 'mapView') {
          await findAll()
        }

        return result
      } catch (error) {
        console.error(error)
      }
    }

    async function deleteIssues() {
      try {
        const data = await $strapi.$http.$post(`/issues/bulk-delete`, {
          data: { ids: selectedIssues.value },
        })

        selectedIssues.value = []
        if (view.value === 'listView') {
          resetLoader()
        } else if (view.value === 'mapView') {
          await findAll()
        }
        return data
      } catch (error) {
        console.error(error)
      }
    }

    async function updateIssues(payload) {
      try {
        const data = await $strapi.$http.$post(`/issues/bulk-update`, {
          ids: selectedIssues.value,
          data: payload,
        })

        selectedIssues.value = []
        if (view.value === 'listView') {
          resetLoader()
        } else if (view.value === 'mapView') {
          await findAll()
        }
        return data
      } catch (error) {
        console.error(error)
      }
    }

    function setFiltersFromQueryParams(query) {
      if (query.location) {
        issueFilter.value = { ...issueFilter.value, location: { id: query.location } }
      }
      if (query.car) {
        issueFilter.value = { ...issueFilter.value, car: { id: query.car } }
      }
      if (query.bicycle) {
        issueFilter.value = { ...issueFilter.value, bicycle: { id: query.bicycle } }
      }
      if (query.label) {
        issueFilter.value = { ...issueFilter.value, label: query.label }
      }
    }

    const query = computed(() => {
      const filters = []

      if (issueFilter.value.searchInput !== '') {
        filters.push({
          $or: [
            {
              name: {
                $containsi: issueFilter.value.searchInput,
              },
            },
            {
              room: {
                location: {
                  address: {
                    address: {
                      $containsi: issueFilter.value.searchInput,
                    },
                  },
                },
              },
            },
            {
              room: {
                location: {
                  address: {
                    city: {
                      $contains: issueFilter.value.searchInput,
                    },
                  },
                },
              },
            },
            {
              todo: {
                users: {
                  email: {
                    $contains: issueFilter.value.searchInput,
                  },
                },
              },
            },
            {
              todo: {
                users: {
                  team: {
                    $contains: issueFilter.value.searchInput,
                  },
                },
              },
            },
            {
              todo: {
                users: {
                  name: {
                    $contains: issueFilter.value.searchInput,
                  },
                },
              },
            },
          ],
        })
      }

      if (issueFilter.value.user !== '' && issueFilter.value.user !== undefined) {
        if (issueFilter.value?.user?.id === null) {
          filters.push({
            todo: { users: { id: { $null: true } } },
          })
        } else {
          filters.push({
            todo: { users: { id: { $eq: issueFilter?.value?.user?.id } } },
          })
        }
      }

      if (issueFilter.value.createdByUser !== '' && issueFilter.value.createdByUser !== undefined) {
        if (issueFilter.value.createdByUser === 'null') {
          filters.push({
            createdByUser: { id: { $null: true } },
          })
        } else {
          filters.push({
            createdByUser: {
              id: { $eq: issueFilter?.value?.createdByUser?.id },
            },
          })
        }
      }

      if (issueFilter.value.deadline !== '') {
        filters.push({
          deadline: { $eq: issueFilter.value.deadline },
        })
      }

      if (typeFilter.value) {
        filters.push({
          type: { $eq: typeFilter.value },
        })
      }

      if (issueFilter.value.created !== '') {
        filters.push({
          created: { $eq: issueFilter.value.created },
        })
      }

      if (issueFilter.value.finished !== '') {
        filters.push({
          finished: { $eq: issueFilter.value.finished },
        })
      }

      if (issueFilter.value.status !== '') {
        filters.push({
          status: { $eq: issueFilter.value.status },
        })
      }

      if (issueFilter.value.label !== '') {
        filters.push({
          $or: [
            {
              issue: {
                label: { $eq: issueFilter.value.label },
              },
            },
            { label: { $eq: issueFilter.value.label } },
          ],
        })
      }

      if (issueFilter.value.location) {
        filters.push({
          room: {
            location: {
              id: {
                $eq: issueFilter.value.location.id,
              },
            },
          },
        })
      }

      if (issueFilter.value.car) {
        filters.push({
          car: {
            id: {
              $eq: issueFilter.value.car.id,
            },
          },
        })
      }

      if (issueFilter.value.bicycle) {
        filters.push({
          bicycle: {
            id: {
              $eq: issueFilter.value.bicycle.id,
            },
          },
        })
      }

      if (issueFilter.value.team.length) {
        filters.push({
          room: {
            location: {
              team: {
                id: { $in: issueFilter.value.team.map((team) => team.id) },
              },
            },
          },
        })
      }

      return {
        filters: { $and: [...defaultFilters.value, ...filters] },
        sort: issueFilter.value.sorting,
      }
    })

    watch(
      query,
      () => {
        resetLoader()
      },
      { deep: true }
    )

    return {
      issues,
      loader,
      loading,
      view,
      activeTab,
      selectedIssues,
      actionsWizardActive,
      page,
      totalIssues,
      detailTab,
      defaultFilters,
      issueFilter,
      typeFilter,
      query,
      issue,
      form,
      selectedColumns,
      resetLoader,
      clearForm,
      findIssues,
      setFiltersFromQueryParams,
      findIssue,
      findAll,
      updateIssue,
      createIssue,
      deleteIssue,
      createTodo,
      createTodos,
      deleteIssues,
      updateIssues,
      resetFilter,
    }
  },
  {
    persistedState: {
      persist: true,
      includePaths: ['issueFilter', 'selectedColumns', 'activeTab'],
    },
  }
)

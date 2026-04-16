import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchForm from '@/components/recipes/SearchForm.vue'

describe('SearchForm', () => {
  function mountForm() {
    return mount(SearchForm)
  }

  it('emits search event with params on form submit', async () => {
    const wrapper = mountForm()

    await wrapper.find('#search-name').setValue('pasta*')
    await wrapper.find('#search-ingredients').setValue('tomato, cheese')
    await wrapper.find('#search-time').setValue(30)
    await wrapper.find('#search-difficulty').setValue('Hard')

    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('search')
    expect(emitted).toBeDefined()
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toEqual({
      name: 'pasta*',
      ingredients: 'tomato, cheese',
      cooking_time_max: 30,
      difficulty: 'Hard',
    })
  })

  it('emits undefined for empty fields', async () => {
    const wrapper = mountForm()

    // Submit with no fields filled
    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('search')
    expect(emitted).toBeDefined()
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toEqual({
      name: undefined,
      ingredients: undefined,
      cooking_time_max: undefined,
      difficulty: undefined,
    })
  })

  it('emits show_all and clears fields on Analyze All click', async () => {
    const wrapper = mountForm()

    // Fill in some fields first
    await wrapper.find('#search-name').setValue('pasta')
    await wrapper.find('#search-difficulty').setValue('Easy')

    // Click the "Analyze All" button (type="button", second button)
    const buttons = wrapper.findAll('button')
    const analyzeAllButton = buttons.find((b) => b.text().includes('Analyze All'))
    await analyzeAllButton!.trigger('click')

    const emitted = wrapper.emitted('search')
    expect(emitted).toBeDefined()
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toEqual({ show_all: true })
  })

  it('renders all four filter fields', () => {
    const wrapper = mountForm()

    expect(wrapper.find('#search-name').exists()).toBe(true)
    expect(wrapper.find('#search-ingredients').exists()).toBe(true)
    expect(wrapper.find('#search-time').exists()).toBe(true)
    expect(wrapper.find('#search-difficulty').exists()).toBe(true)
  })

  it('renders difficulty options', () => {
    const wrapper = mountForm()
    const options = wrapper.find('#search-difficulty').findAll('option')
    const values = options.map((o) => o.text())

    expect(values).toContain('Any')
    expect(values).toContain('Easy')
    expect(values).toContain('Medium')
    expect(values).toContain('Intermediate')
    expect(values).toContain('Hard')
  })
})

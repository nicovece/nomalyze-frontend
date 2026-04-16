import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import type { Recipe } from '@/types/recipe'

const mockRecipe: Recipe = {
  id: 1,
  name: 'Spaghetti Carbonara',
  short_description: 'A classic Italian pasta dish.',
  ingredients: 'spaghetti, eggs, pancetta, parmesan',
  ingredients_list: ['spaghetti', 'eggs', 'pancetta', 'parmesan'],
  cooking_time: 25,
  difficulty: 'Hard',
  likes: 10,
  references: 'https://example.com',
  recipe_image: '/media/recipes/carbonara.jpg',
}

describe('RecipeCard', () => {
  function mountCard(recipe: Recipe = mockRecipe) {
    return mount(RecipeCard, {
      props: { recipe },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })
  }

  it('renders the recipe name', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Spaghetti Carbonara')
  })

  it('renders the cooking time', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('25 min')
  })

  it('renders the difficulty badge', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Hard')
  })

  it('renders the short description', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('A classic Italian pasta dish.')
  })

  it('links to the correct detail page', () => {
    const wrapper = mountCard()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({
      name: 'recipe-detail',
      params: { id: 1 },
    })
  })

  it('applies the correct difficulty color class for Hard', () => {
    const wrapper = mountCard()
    const badge = wrapper.find('span.rounded-full')
    expect(badge.classes()).toContain('bg-accent-400')
  })

  it('applies the correct difficulty color class for Easy', () => {
    const wrapper = mountCard({ ...mockRecipe, difficulty: 'Easy' })
    const badge = wrapper.find('span.rounded-full')
    expect(badge.classes()).toContain('bg-ground-b')
  })

  it('hides description when empty', () => {
    const wrapper = mountCard({ ...mockRecipe, short_description: '' })
    // The description paragraph should not render (v-if)
    expect(wrapper.text()).not.toContain('A classic Italian pasta dish.')
  })

  it('renders the recipe image with correct alt text', () => {
    const wrapper = mountCard()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/media/recipes/carbonara.jpg')
    expect(img.attributes('alt')).toBe('Spaghetti Carbonara')
  })
})

<template>
	<!--
		🏪 Products Page Template
		This page displays all products with a header, call-to-action, and product grid
		It uses Nuxt Content to query and display products from the /content/products/ directory
	-->
	<UPage>
		<!-- 📢 Page Header Section -->
		<UPageHero
			title="Our Products"
			description="Discover our carefully curated collection of premium products designed to enhance your daily life."
			:ui="{
				title: '!mx-0 text-left text-4xl sm:text-5xl lg:text-6xl font-bold',
				description: '!mx-0 text-left text-lg sm:text-xl text-muted mt-4 max-w-3xl'
			}"
		>
			<!-- 🚀 Call-to-Action Buttons in Hero -->
			<template #links>
				<div class="flex flex-col sm:flex-row gap-3 mt-6">
					<!-- 🛒 Primary CTA - Shop All Products -->
					<UButton
						label="Shop All Products"
						size="lg"
						color="primary"
						variant="solid"
						@click="scrollToProducts"
					>
						<!-- 🛒 Shopping bag icon -->
						<template #leading>
							<UIcon
								name="i-lucide-shopping-bag"
								class="w-5 h-5"
							/>
						</template>
					</UButton>

					<!-- ⭐ Secondary CTA - View Featured -->
					<UButton
						label="Featured Products"
						size="lg"
						color="primary"
						variant="outline"
						@click="showFeaturedOnly"
					>
						<!-- ⭐ Star icon -->
						<template #leading>
							<UIcon
								name="i-lucide-star"
								class="w-5 h-5"
							/>
						</template>
					</UButton>
				</div>
			</template>
		</UPageHero>

		<!-- 📊 Products Section -->
		<UPageSection
			:ui="{
				container: '!pt-8 sm:!pt-12'
			}"
		>
			<!-- 🎛️ Filter and Sort Controls -->
			<div class="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<!-- 📊 Results Summary -->
				<div class="text-sm text-gray-600 dark:text-gray-400">
					<span v-if="filteredProducts">
						Showing {{ filteredProducts.length }} of {{ products?.length || 0 }} products
					</span>
					<span
						v-if="activeFilters.category"
						class="ml-2 text-primary-600"
					>
						in {{ activeFilters.category }}
					</span>
				</div>

				<!-- 🎛️ Filter Controls -->
				<div class="flex flex-wrap gap-3">
					<!-- 📂 Category Filter -->
					<USelect
						v-model="activeFilters.category"
						:options="categoryOptions"
						placeholder="All Categories"
						size="sm"
						class="w-40"
					/>

					<!-- 📊 Sort Options -->
					<USelect
						v-model="activeFilters.sortBy"
						:options="sortOptions"
						placeholder="Sort by"
						size="sm"
						class="w-40"
					/>

					<!-- ⭐ Featured Filter Toggle -->
					<UToggle
						v-model="activeFilters.featuredOnly"
						label="Featured Only"
					/>

					<!-- 🔄 Reset Filters Button -->
					<UButton
						v-if="hasActiveFilters"
						variant="ghost"
						size="sm"
						@click="resetFilters"
					>
						Reset Filters
						<template #trailing>
							<UIcon
								name="i-lucide-x"
								class="w-4 h-4"
							/>
						</template>
					</UButton>
				</div>
			</div>

			<!-- 🏪 Products Grid -->
			<div ref="productsSection">
				<!-- ⏳ Loading State -->
				<div
					v-if="pending"
					class="flex items-center justify-center py-12"
				>
					<UIcon
						name="i-lucide-loader-2"
						class="w-8 h-8 animate-spin text-primary-500"
					/>
					<span class="ml-2 text-gray-600 dark:text-gray-400">
						Loading products...
					</span>
				</div>

				<!-- ❌ Error State -->
				<div
					v-else-if="error"
					class="text-center py-12"
				>
					<UIcon
						name="i-lucide-alert-circle"
						class="w-12 h-12 text-red-500 mx-auto mb-4"
					/>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						Oops! Something went wrong
					</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-4">
						We couldn't load the products. Please try again.
					</p>
					<UButton
						variant="outline"
						@click="refresh()"
					>
						Try Again
					</UButton>
				</div>

				<!-- 📦 No Products State -->
				<div
					v-else-if="!filteredProducts || filteredProducts.length === 0"
					class="text-center py-12"
				>
					<UIcon
						name="i-lucide-package-x"
						class="w-12 h-12 text-gray-400 mx-auto mb-4"
					/>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						No products found
					</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-4">
						{{ hasActiveFilters
							? 'Try adjusting your filters to see more results.'
							: 'Check back soon for new products!'
						}}
					</p>
					<UButton
						v-if="hasActiveFilters"
						variant="outline"
						@click="resetFilters"
					>
						Clear Filters
					</UButton>
				</div>

				<!-- 🎯 Products Grid - Main Content -->
				<div
					v-else
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
				>
					<!-- 🔄 Loop through each filtered product and render a ProductCard -->
					<ProductCard
						v-for="product in filteredProducts"
						:key="product.sku"
						:product="product"
					/>
				</div>
			</div>
		</UPageSection>

		<!-- 📢 Additional Call-to-Action Section -->
		<UPageSection class="bg-gray-50 dark:bg-gray-900/50">
			<div class="text-center max-w-2xl mx-auto">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Can't find what you're looking for?
				</h2>

				<p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
					Get in touch with our team and we'll help you find the perfect product for your needs.
				</p>

				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<!-- 📞 Contact CTA -->
					<UButton
						label="Contact Us"
						size="lg"
						color="primary"
						variant="solid"
						to="/contact"
					>
						<template #leading>
							<UIcon
								name="i-lucide-mail"
								class="w-5 h-5"
							/>
						</template>
					</UButton>

					<!-- 🔔 Newsletter CTA -->
					<UButton
						label="Get Notified of New Products"
						size="lg"
						color="primary"
						variant="outline"
						@click="showNewsletterSignup"
					>
						<template #leading>
							<UIcon
								name="i-lucide-bell"
								class="w-5 h-5"
							/>
						</template>
					</UButton>
				</div>
			</div>
		</UPageSection>
	</UPage>
</template>

<script setup lang="ts">
// 📝 Import necessary types and composables
// Import the Product type that matches our content schema
type Product = {
	// 📄 Basic content fields from Nuxt Content
	_path?: string // 🛣️ File path (auto-generated by Nuxt Content)
	title: string // 📝 Product name
	description: string // 📖 Product description

	// 💰 Pricing information
	price: number // 💵 Current price
	originalPrice?: number // 🏷️ Original price (optional)

	// 🖼️ Visual elements
	image: string // 📸 Main product image URL
	gallery?: Array<{ // 🖼️ Additional images (optional)
		src: string
		alt: string
	}>

	// 🏷️ Classification
	category: string // 📂 Product category
	tags?: string[] // 🏷️ Product tags (optional)
	sku: string // 🔢 Stock keeping unit

	// 📊 Status
	inStock: boolean // ✅ Availability status
	featured: boolean // ⭐ Featured status

	// 📅 Dates
	publishedAt: string // 📅 Publication date
	updatedAt?: string // 📅 Last update (optional)

	// ✨ Product details
	features?: string[] // 🎯 Key features (optional)
	specifications?: { // 🔧 Technical specs (optional)
		dimensions?: string
		weight?: string
		material?: string
		color?: string
	}

	// 🚀 Call-to-action
	cta?: { // 🛒 CTA configuration (optional)
		label?: string
		url?: string
		enabled?: boolean
	}

	// 📈 SEO
	seo?: { // 🔍 SEO settings (optional)
		title?: string
		description?: string
		keywords?: string[]
	}
}

// 🎯 Page Metadata
// Set up SEO meta tags for the products page
useSeoMeta({
	title: 'Products - Premium Quality Items | Your Store',
	description: 'Browse our collection of premium products including electronics, wearables, and accessories. Find the perfect items for your lifestyle.',
	ogTitle: 'Shop Premium Products | Your Store',
	ogDescription: 'Discover our carefully curated collection of high-quality products.',
	keywords: 'products, electronics, accessories, premium quality, online shopping'
})

// 📊 Reactive Filter State
// These reactive variables control filtering and sorting of products
const activeFilters = reactive({
	category: '', // 📂 Selected category filter
	sortBy: 'newest', // 📊 Current sort method
	featuredOnly: false // ⭐ Show only featured products
})

// 🔍 Refs for DOM elements
const productsSection = ref<HTMLElement>() // 📍 Reference to products section for scrolling

// 📡 Fetch Products Data
// Use Nuxt Content's queryCollection to get all products from /content/products/*.md
const {
	data: products, // 📦 Array of all products
	pending, // ⏳ Loading state
	error, // ❌ Error state
	refresh // 🔄 Function to refetch data
} = await useAsyncData('products', async (): Promise<Product[]> => {
	// 📋 Query all products and ensure they're typed correctly
	const result = await queryCollection('products')
		.all() // 📋 Get all products

	// 📅 Sort by newest first (descending publishedAt)
	const sorted = (result as unknown as Product[]).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

	// 🎯 Return as Product array
	return sorted
})

// 🚨 Error Handling
// If we can't load products, throw an error that Nuxt will handle
if (!products.value) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Products not found'
	})
}

// 📊 Computed Properties for Dynamic Options

// 📂 Category Options - Extract unique categories from products
const categoryOptions = computed(() => {
	if (!products.value || !Array.isArray(products.value)) return []

	// 🔍 Get unique categories from all products
	const categories = [ ...new Set(products.value.map((p: Product) => p.category)) ]

	// 🎯 Format for USelect component
	return [
		{ label: 'All Categories',
			value: '' },
		...categories.map(cat => ({ label: cat,
			value: cat }))
	]
})

// 📊 Sort Options - Define available sorting methods
const sortOptions = [
	{ label: 'Newest First',
		value: 'newest' },
	{ label: 'Oldest First',
		value: 'oldest' },
	{ label: 'Price: Low to High',
		value: 'price-asc' },
	{ label: 'Price: High to Low',
		value: 'price-desc' },
	{ label: 'Name A-Z',
		value: 'name-asc' },
	{ label: 'Name Z-A',
		value: 'name-desc' }
]

// 🎛️ Filtered and Sorted Products
// This computed property applies all active filters and sorting
const filteredProducts = computed((): Product[] => {
	if (!products.value || !Array.isArray(products.value)) return []

	let result: Product[] = [ ...products.value ] // 📋 Start with all products

	// 📂 Apply category filter
	if (activeFilters.category) {
		result = result.filter((product: Product) => product.category === activeFilters.category)
	}

	// ⭐ Apply featured filter
	if (activeFilters.featuredOnly) {
		result = result.filter((product: Product) => product.featured)
	}

	// 📊 Apply sorting
	switch (activeFilters.sortBy) {
		case 'newest':
			result.sort((a: Product, b: Product) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
			break
		case 'oldest':
			result.sort((a: Product, b: Product) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
			break
		case 'price-asc':
			result.sort((a: Product, b: Product) => a.price - b.price)
			break
		case 'price-desc':
			result.sort((a: Product, b: Product) => b.price - a.price)
			break
		case 'name-asc':
			result.sort((a: Product, b: Product) => a.title.localeCompare(b.title))
			break
		case 'name-desc':
			result.sort((a: Product, b: Product) => b.title.localeCompare(a.title))
			break
	}

	return result
})

// 🔍 Check if any filters are active
const hasActiveFilters = computed(() => {
	return activeFilters.category !== '' || activeFilters.featuredOnly || activeFilters.sortBy !== 'newest'
})

// 🎯 Interactive Functions

// 📍 Scroll to products section smoothly
function scrollToProducts() {
	productsSection.value?.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
}

// ⭐ Show only featured products
function showFeaturedOnly() {
	activeFilters.featuredOnly = true
	scrollToProducts()
}

// 🔄 Reset all filters to default state
function resetFilters() {
	activeFilters.category = ''
	activeFilters.sortBy = 'newest'
	activeFilters.featuredOnly = false
}

// 🔔 Show newsletter signup (placeholder function)
function showNewsletterSignup() {
	// 🚀 In a real application, this would:
	// 1. Open a modal with newsletter signup form
	// 2. Or navigate to a newsletter page
	// 3. Or show an inline form

	alert('📧 Newsletter signup coming soon! Stay tuned for updates.')

	// 🎯 Example implementation:
	// const modal = useModal()
	// modal.open(NewsletterSignupModal)
}

// 🎨 Watch for filter changes and smooth scroll to results
watch(() => activeFilters, () => {
	// 📍 When filters change, scroll to products after a short delay
	// This gives the UI time to update before scrolling
	nextTick(() => {
		if (hasActiveFilters.value) {
			setTimeout(() => scrollToProducts(), 150)
		}
	})
}, { deep: true })

// 📊 Console log for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
	console.log('🏪 Products page loaded:', {
		totalProducts: products.value?.length,
		categories: categoryOptions.value,
		filters: activeFilters
	})
}
</script>

<style scoped>
/*
🎨 Custom styles for the products page
These styles enhance the default Tailwind classes
*/

/* 🌊 Smooth transitions for filter changes */
.grid {
	transition: all 0.3s ease-in-out;
}

/* 📱 Responsive grid improvements */
@media (min-width: 1280px) {
	.grid {
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	}
}

/* 🎯 Focus states for accessibility */
.focus\:ring-2:focus {
	outline-width: 2px;
	outline-color: rgb(59 130 246); /* blue-500 */
	outline-style: solid;
}

/* 🌙 Dark mode enhancements */
@media (prefers-color-scheme: dark) {
	.bg-gray-50 {
		background-color: rgb(17 24 39 / 0.5); /* gray-900/50 */
	}
}
</style>

<template>
	<!--
    🎯 ProductCard Component
    This component displays individual product information in a card format
    It receives a product object as a prop and renders it with styling
  -->
	<div class="group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
		<!-- 📸 Product Image Section -->
		<div class="relative aspect-square overflow-hidden">
			<!-- 🖼️ Main product image with hover effect -->
			<img
				:src="product.image"
				:alt="product.title"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				loading="lazy"
			>

			<!-- ⭐ Featured badge - only shows if product.featured is true -->
			<div
				v-if="product.featured"
				class="absolute top-3 left-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium"
			>
				⭐ Featured
			</div>

			<!-- 🏷️ Discount badge - only shows if originalPrice exists and is higher than current price -->
			<div
				v-if="product.originalPrice && product.originalPrice > product.price"
				class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
			>
				<!-- 📊 Calculate and display discount percentage -->
				{{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
			</div>

			<!-- 📦 Out of stock overlay - only shows if product.inStock is false -->
			<div
				v-if="!product.inStock"
				class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
			>
				<span class="text-white font-semibold text-lg">
					Out of Stock
				</span>
			</div>
		</div>

		<!-- 📝 Product Information Section -->
		<div class="p-4">
			<!-- 📂 Category label -->
			<div class="mb-2">
				<span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs font-medium">
					{{ product.category }}
				</span>
			</div>

			<!-- 📄 Product title -->
			<h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
				{{ product.title }}
			</h3>

			<!-- 📖 Product description -->
			<p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
				{{ product.description }}
			</p>

			<!-- 🏷️ Product tags - only show if tags exist -->
			<div
				v-if="product.tags && product.tags.length > 0"
				class="mb-3"
			>
				<div class="flex flex-wrap gap-1">
					<!-- 🏷️ Loop through each tag and display it -->
					<span
						v-for="tag in product.tags.slice(0, 3)"
						:key="tag"
						class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs"
					>
						#{{ tag }}
					</span>
					<!-- 📊 Show "+X more" if there are more than 3 tags -->
					<span
						v-if="product.tags.length > 3"
						class="text-gray-500 text-xs px-2 py-1"
					>
						+{{ product.tags.length - 3 }} more
					</span>
				</div>
			</div>

			<!-- 💰 Pricing section -->
			<div class="mb-4">
				<div class="flex items-center gap-2">
					<!-- 💵 Current price -->
					<span class="text-2xl font-bold text-gray-900 dark:text-white">
						${{ product.price.toFixed(2) }}
					</span>

					<!-- 🏷️ Original price with strikethrough - only show if originalPrice exists -->
					<span
						v-if="product.originalPrice && product.originalPrice > product.price"
						class="text-sm text-gray-500 line-through"
					>
						${{ product.originalPrice.toFixed(2) }}
					</span>
				</div>

				<!-- 💾 Stock status indicator -->
				<div class="mt-1">
					<span
						:class="[
							'text-xs font-medium',
							product.inStock
								? 'text-green-600 dark:text-green-400'
								: 'text-red-600 dark:text-red-400'
						]"
					>
						{{ product.inStock ? '✅ In Stock' : '❌ Out of Stock' }}
					</span>
				</div>
			</div>

			<!-- 🚀 Call-to-action button section -->
			<div class="flex gap-2">
				<!-- 🛒 Main CTA button - only show if cta.enabled is true (or cta doesn't exist, defaults to true) -->
				<UButton
					v-if="!product.cta || product.cta.enabled !== false"
					:label="product.cta?.label || 'Add to Cart'"
					:disabled="!product.inStock"
					:to="product.cta?.url"
					color="primary"
					size="sm"
					class="flex-1"
					@click="handleAddToCart"
				>
					<!-- 🛒 Shopping cart icon -->
					<template #leading>
						<UIcon
							name="i-lucide-shopping-cart"
							class="w-4 h-4"
						/>
					</template>
				</UButton>

				<!-- 👁️ View details button -->
				<UButton
					:to="`/products/${product._path?.split('/').pop()?.replace('.md', '')}`"
					variant="outline"
					size="sm"
					color="neutral"
				>
					<!-- 👁️ Eye icon for view details -->
					<UIcon
						name="i-lucide-eye"
						class="w-4 h-4"
					/>
				</UButton>
			</div>

			<!-- ✨ Features preview - show first 2 features if they exist -->
			<div
				v-if="product.features && product.features.length > 0"
				class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800"
			>
				<div class="text-xs text-gray-600 dark:text-gray-400">
					<div class="font-medium mb-1">
						Key Features:
					</div>
					<!-- 🎯 Show first 2 features as bullet points -->
					<ul class="list-disc list-inside space-y-0.5">
						<li
							v-for="feature in product.features.slice(0, 2)"
							:key="feature"
						>
							{{ feature }}
						</li>
						<!-- 📊 Show "+X more features" if there are more than 2 -->
						<li
							v-if="product.features.length > 2"
							class="text-gray-500"
						>
							+{{ product.features.length - 2 }} more features
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// 📝 Import types from Nuxt Content for proper TypeScript support

// 🎯 Define the expected structure of a product
// This interface matches our content schema defined in content.config.ts
interface Product {
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

// 🎯 Define component props
// The parent component must pass a product object that matches our Product interface
interface Props {
	product: Product // 📦 The product data to display
}

// 📥 Accept the product prop from parent component
const props = defineProps<Props>()

// 🛒 Handle add to cart functionality
// This function will be called when the CTA button is clicked
function handleAddToCart() {
	// 🚀 In a real application, this would:
	// 1. Add the product to a shopping cart store (Pinia/Vuex)
	// 2. Show a success notification
	// 3. Update cart count in the header
	// 4. Maybe redirect to cart page

	console.log('🛒 Adding to cart:', props.product.title)

	// 📢 For now, we'll just show a browser alert
	// In production, replace this with proper cart integration
	alert(`✅ "${props.product.title}" has been added to your cart!`)

	// 🎯 Example of how you might integrate with a cart store:
	// const cartStore = useCartStore()
	// cartStore.addItem({
	//   id: props.product.sku,
	//   title: props.product.title,
	//   price: props.product.price,
	//   image: props.product.image,
	//   quantity: 1
	// })
}
</script>

<style scoped>
/*
📝 Custom CSS for text truncation using Tailwind's line-clamp utilities
These utilities help ensure consistent card heights by limiting text overflow
*/

/* 📖 Limit title to 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 📖 Limit description to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 🎨 Custom hover effects for the card */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* 🌙 Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .group {
    border-color: rgb(55 65 81); /* gray-700 */
  }
}
</style>

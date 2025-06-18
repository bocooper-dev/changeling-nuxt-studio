import {
	defineCollection,
	defineContentConfig,
	z
} from '@nuxt/content'

const createBaseSchema = () => z.object({
	title: z.string(),
	description: z.string()
})

const createButtonSchema = () => z.object({
	label: z.string(),
	icon: z.string().optional(),
	to: z.string().optional(),
	color: z.enum([ 'primary', 'neutral', 'success', 'warning', 'error', 'info' ]).optional(),
	size: z.enum([ 'xs', 'sm', 'md', 'lg', 'xl' ]).optional(),
	variant: z.enum([ 'solid', 'outline', 'subtle', 'soft', 'ghost', 'link' ]).optional(),
	target: z.enum([ '_blank', '_self' ]).optional()
})

const createImageSchema = () => z.object({
	src: z.string().editor({ input: 'media' }),
	alt: z.string()
})

const createAuthorSchema = () => z.object({
	name: z.string(),
	description: z.string().optional(),
	username: z.string().optional(),
	twitter: z.string().optional(),
	to: z.string().optional(),
	avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
	quote: z.string(),
	author: createAuthorSchema()
})

export default defineContentConfig({
	collections: {
		index: defineCollection({
			type: 'page',
			source: 'index.yml',
			schema: z.object({
				hero: z.object({
					links: z.array(createButtonSchema()),
					images: z.array(createImageSchema())
				}),
				about: createBaseSchema(),
				experience: createBaseSchema().extend({
					items: z.array(z.object({
						date: z.date(),
						position: z.string(),
						company: z.object({
							name: z.string(),
							url: z.string(),
							logo: z.string().editor({ input: 'icon' }),
							color: z.string()
						})
					}))
				}),
				testimonials: z.array(createTestimonialSchema()),
				blog: createBaseSchema(),
				faq: createBaseSchema().extend({
					categories: z.array(
						z.object({
							title: z.string().nonempty(),
							questions: z.array(
								z.object({
									label: z.string().nonempty(),
									content: z.string().nonempty()
								})
							)
						}))
				})
			})
		}),
		projects: defineCollection({
			type: 'data',
			source: 'projects/*.yml',
			schema: z.object({
				title: z.string().nonempty(),
				description: z.string().nonempty(),
				image: z.string().nonempty().editor({ input: 'media' }),
				url: z.string().nonempty(),
				tags: z.array(z.string()),
				date: z.date()
			})
		}),
		blog: defineCollection({
			type: 'page',
			source: 'blog/*.md',
			schema: z.object({
				minRead: z.number(),
				date: z.date(),
				image: z.string().nonempty().editor({ input: 'media' }),
				author: createAuthorSchema()
			})
		}),
		pages: defineCollection({
			type: 'page',
			source: [
				{ include: 'projects.yml' },
				{ include: 'blog.yml' }
			],
			schema: z.object({
				links: z.array(createButtonSchema())
			})
		}),
		speaking: defineCollection({
			type: 'page',
			source: 'speaking.yml',
			schema: z.object({
				links: z.array(createButtonSchema()),
				events: z.array(z.object({
					category: z.enum([ 'Live talk', 'Podcast', 'Conference' ]),
					title: z.string(),
					date: z.date(),
					location: z.string(),
					url: z.string().optional()
				}))
			})
		}),
		about: defineCollection({
			type: 'page',
			source: 'about.yml',
			schema: z.object({
				content: z.object({}),
				images: z.array(createImageSchema())
			})
		}),
		// 📦 Products collection - defines the structure for our product pages
		products: defineCollection({
			type: 'page', // 📄 'page' type means markdown files with frontmatter + content
			source: 'products/*.md', // 📁 Look for .md files in /content/products/ directory
			schema: z.object({
				// 💰 Pricing information
				price: z.number().positive(), // 💵 Product price (must be positive number)
				originalPrice: z.number().positive().optional(), // 🏷️ Original price for showing discounts (optional)

				// 🖼️ Visual elements
				image: z.string().nonempty().editor({ input: 'media' }), // 📸 Product image (Nuxt Studio media picker)
				gallery: z.array(createImageSchema()).optional(), // 🖼️ Additional product images (optional)

				// 🏷️ Product categorization and metadata
				category: z.string().nonempty(), // 📂 Product category (e.g., "Electronics", "Clothing")
				tags: z.array(z.string()).optional(), // 🏷️ Product tags for filtering (optional)
				sku: z.string().nonempty(), // 🔢 Stock Keeping Unit - unique product identifier

				// 📊 Product status and availability
				inStock: z.boolean().default(true), // ✅ Whether product is available (defaults to true)
				featured: z.boolean().default(false), // ⭐ Whether to highlight this product (defaults to false)

				// 📅 Important dates
				publishedAt: z.date(), // 📅 When product was published
				updatedAt: z.date().optional(), // 📅 Last update date (optional)

				// 🎯 Product specifications and features
				features: z.array(z.string()).optional(), // ✨ Key product features (optional)
				specifications: z.object({ // 🔧 Technical specs (all optional)
					dimensions: z.string().optional(), // 📏 Product dimensions
					weight: z.string().optional(), // ⚖️ Product weight
					material: z.string().optional(), // 🧱 What it's made of
					color: z.string().optional() // 🎨 Available colors
				}).optional(),

				// 🚀 Call-to-action configuration
				cta: z.object({
					label: z.string().default('Add to Cart'), // 🛒 Button text (defaults to "Add to Cart")
					url: z.string().url().optional(), // 🔗 External purchase link (optional)
					enabled: z.boolean().default(true) // ✅ Whether to show CTA button (defaults to true)
				}).optional(),

				// 📈 SEO and social sharing
				seo: z.object({
					title: z.string().optional(), // 📝 Custom SEO title (optional)
					description: z.string().optional(), // 📝 Custom SEO description (optional)
					keywords: z.array(z.string()).optional() // 🔍 SEO keywords (optional)
				}).optional()
			})
		})
	}
})

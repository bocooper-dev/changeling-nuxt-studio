<template>
	<div>
		<UContainer class="sm:border-x border-default pt-10">
			<AppHeader :links="navLinks" />
			<slot />
			<AppFooter />
		</UContainer>
	</div>
</template>

<script setup lang="ts">
</script>

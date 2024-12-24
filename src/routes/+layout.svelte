<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">home</a>
	<a href="/counter">counter</a>
</nav>

{@render children()}
<script>
	
	import "../app.css";
	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { Icon } from "svelte-icons-pack";
	import { CiDark } from "svelte-icons-pack/ci";
	import { CiLight } from "svelte-icons-pack/ci";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Menubar from "$lib/components/ui/menubar/index.js";

	let { children } = $props();
</script>
<ModeWatcher />
<nav class="flex w-full items-center gap-1">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Item>
				<a href="/">home</a>
			</Menubar.Item>
			<Menubar.Item>
				<a href="/counter">counter</a>
			</Menubar.Item>
            <Menubar.Item>
				<a href="/dashboard">dashboard</a>
			</Menubar.Item>
		</Menubar.Menu>
	</Menubar.Root>
	
	
	<Button on:click={toggleMode} variant="outline" size="icon">
		<Icon
			src={CiLight}
			className="h-[1.2rem] w-[1.2rem] dark:-rotate-90 dark:hidden"
		/>
		<Icon
			src={CiDark}
			className="h-[1.2rem] w-[1.2rem] dark:rotate-0 dark:block hidden"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</nav>



<main class="flex flex-col gap-2 w-full items-center">
{@render children()}
</main>
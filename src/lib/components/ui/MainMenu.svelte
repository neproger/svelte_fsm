<script>
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import ActionButton from "$lib/components/ui/ActionButton.svelte";
    import House from "lucide-svelte/icons/house";
    import Package2 from "lucide-svelte/icons/package-2";
    import ShoppingCart from "lucide-svelte/icons/shopping-cart";
    import Package from "lucide-svelte/icons/package";
    import UsersRound from "lucide-svelte/icons/users-round";
    import ChartLine from "lucide-svelte/icons/chart-line";
    let { currentPath } = $props();
</script>

<!-- <a
    href="##"
    class="bg-primary text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
>
    <Package2 class="h-4 w-4 transition-all group-hover:scale-110" />
    <span class="sr-only">Acme Inc</span>
</a> -->
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <ActionButton isActive={currentPath === "/"} builder url="/" isMobile={false}>
            <House class="h-5 w-5" />
            <span class="sm:not-sr-only">Home</span>
        </ActionButton>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">Home</Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <ActionButton
            isActive={currentPath === "/counter"}
            builder
            url="/counter"
        >
            <ShoppingCart class="h-5 w-5" />
            <span class="sr-only">Counter</span>
        </ActionButton>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">Counter</Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <ActionButton
            isActive={currentPath === "/dashboard"}
            builder
            url="/dashboard"
        >
            <Package class="h-5 w-5" />
            <span class="sr-only">Dashboard</span>
        </ActionButton>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">Dashboard</Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <a
            href="##"
            class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
            use:builder.action
            {...builder}
        >
            <UsersRound class="h-5 w-5" />
            <span class="sr-only">Customers</span>
        </a>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">Customers</Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <a
            href="##"
            class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
            use:builder.action
            {...builder}
        >
            <ChartLine class="h-5 w-5" />
            <span class="sr-only">Analytics</span>
        </a>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">Analytics</Tooltip.Content>
</Tooltip.Root>

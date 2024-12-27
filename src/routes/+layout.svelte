<script>
    import "../app.css";
    import { ModeWatcher, toggleMode } from "mode-watcher";
    import { Icon } from "svelte-icons-pack";
    import { CiDark } from "svelte-icons-pack/ci";
    import { CiLight } from "svelte-icons-pack/ci";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Menubar from "$lib/components/ui/menubar/index.js";
    import Settings from "lucide-svelte/icons/settings";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import Package2 from "lucide-svelte/icons/package-2";
    import House from "lucide-svelte/icons/house";
    import ShoppingCart from "lucide-svelte/icons/shopping-cart";
    import Package from "lucide-svelte/icons/package";
    import UsersRound from "lucide-svelte/icons/users-round";
    import ChartLine from "lucide-svelte/icons/chart-line";
    import { UserRound } from "lucide-svelte";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import PanelLeft from "lucide-svelte/icons/panel-left";
    import Search from "lucide-svelte/icons/search";

    
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    let { children } = $props();

    import { onNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import MainMenu from "$lib/components/ui/MainMenu.svelte";

    let currentPath = $state($page.url.pathname);
    let isMainMenu = $state(false);
    onNavigate(({ to }) => {
        isMainMenu = false;
        // Коллбэк вызывается перед навигацией
        currentPath = to.url.pathname;
        console.log("Navigating to:", currentPath, isMainMenu);
    });
</script>

<ModeWatcher />

<div class="bg-muted/40 flex min-h-screen w-full flex-col">
    <aside
        class="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex"
    >
        <nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
           <MainMenu currentPath={currentPath}/>
        </nav>
        <nav class="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip.Root>
                <Tooltip.Trigger on:click={toggleMode}>
                    <button onclick={toggleMode} >
                        <Icon
                            src={CiLight}
                            className="h-[1.2rem] w-[1.2rem] dark:-rotate-90 dark:hidden"
                        />
                        <Icon
                            src={CiDark}
                            className="h-[1.2rem] w-[1.2rem] dark:rotate-0 dark:block hidden"
                        />
                        <span class="sr-only">Toggle theme</span>
                    </button>
                </Tooltip.Trigger>
            </Tooltip.Root>

            <Tooltip.Root>
                <Tooltip.Trigger asChild let:builder>
                    <a
                        href="##"
                        class="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                        use:builder.action
                        {...builder}
                    >
                        <Settings class="h-5 w-5" />
                        <span class="sr-only">Settings</span>
                    </a>
                </Tooltip.Trigger>
                <Tooltip.Content side="right">Settings</Tooltip.Content>
            </Tooltip.Root>
        </nav>
    </aside>
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header
            class="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
        >
            <Sheet.Root bind:open={isMainMenu}>
                <Sheet.Trigger asChild let:builder>
                    <Button
                        builders={[builder]}
                        size="icon"
                        variant="outline"
                        class="sm:hidden"
                    >
                        <PanelLeft class="h-5 w-5" />
                        <span class="sr-only">Toggle Menu</span>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="left" class="sm:max-w-xs">
                    <MainMenu currentPath={currentPath}/>
                </Sheet.Content>
            </Sheet.Root>
            <Breadcrumb.Root class="hidden md:flex">
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="##">Dashboard</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="##">Orders</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>Recent Orders</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <div class="relative ml-auto flex-1 md:grow-0">
                <Search
                    class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4"
                />
                <Input
                    type="search"
                    placeholder="Search..."
                    class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button
                        variant="outline"
                        size="icon"
                        class="overflow-hidden rounded-full"
                        builders={[builder]}
                    >
                        <!-- <img
                src="/images/placeholder-user.jpg"
                width={36}
                height={36}
                alt="Avatar"
                class="overflow-hidden rounded-full"
              /> -->
                        <UserRound
                            width={36}
                            height={36}
                            class="overflow-hidden rounded-full"
                        />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Settings</DropdownMenu.Item>
                    <DropdownMenu.Item>Support</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>Logout</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </header>
        <main
            class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
        >
            {@render children()}
        </main>
    </div>
</div>

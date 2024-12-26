<script>
    let { children, isActive, builder, url } = $props();
</script>

<a
    href={url}
    class="hover:text-foreground flex h-9 min-w-9 items-center justify-start sm:justify-center gap-2 rounded-lg transition-colors"
    class:bg-accent={isActive}
    class:text-accent-foreground={isActive}
    class:text-muted-foreground={!isActive}
    use:builder.action
    {...builder}
>
    {@render children()}
</a>

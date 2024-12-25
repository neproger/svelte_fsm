<script>
    import { onMount, onDestroy } from "svelte";
    import { createMachine, assign, interpret } from "xstate";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Progress } from "$lib/components/ui/progress/index.js";

    const machineWithContext = createMachine({
        initial: "inactive",
        context: {
            count: 0,
            input: "",
        },
        states: {
            inactive: {
                on: { ACTIVATE: "active" },
            },
            active: {
                on: {
                    INCREMENT: {
                        actions: assign({
                            count: ({ context }) => context.count + 1, // Обновление контекста
                        }),
                    },
                    INPUT: {
                        actions: assign({
                            input: ({ event }) => event.data, // Использование данных из события
                        }),
                    },
                    DEACTIVATE: "inactive",
                },
            },
        },
    });
    let service = interpret(machineWithContext);

    let currentState = "";
    let count = 0;
    let input = "";

    service.subscribe((snapshot) => {
        currentState = snapshot.value;
        count = snapshot.context.count;
        input = snapshot.context.input;
    });

    function increment() {
        service.send({ type: "INCREMENT" });
    }

    function toggleState() {
        service.send({
            type: currentState === "inactive" ? "ACTIVATE" : "DEACTIVATE",
        });
    }

    // Пример функции для отправки данных в машину
    function updateInput(newData) {
        service.send({ type: "INPUT", data: newData });
    }

    function clearInput() {
        service.send({ type: "INPUT", data: "" });
    }

    onMount(() => {
        service.start();
    });
    onDestroy(() => {
        service.stop();
    });
</script>

<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

        <Card.Root class="sm:col-span-3">
            <Card.Header class="pb-3">
                <Card.Title>Состояние</Card.Title>
                <Card.Description class="max-w-lg text-balance leading-relaxed">
                    <p>{currentState}</p>
                    <p>Текст: {input || "_"}</p>

                    <p>{count}%</p>
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="text-muted-foreground text-xs">
                    {count}% заполнения
                </div>
                <Button variant="secondary" on:click={toggleState}>
                    {currentState === "inactive"
                        ? "Активировать"
                        : "Деактивировать"}
                </Button>
            </Card.Content>
            <Card.Footer>
                <Progress value={count} aria-label={`${count}% increase`} />
            </Card.Footer>
        </Card.Root>

        {#if currentState === "active"}
            <Card.Root>
                <Card.Header class="pb-2">
                    <Card.Description>Настройки</Card.Description>
                </Card.Header>
                <Card.Content сlass="flex gap-4 flex-col">
                    <Button variant="secondary" on:click={increment} >Увеличить</Button >
                    <Input
                        class="max-w-40"
                        type="text"
                        placeholder="_"
                        value={input}
                        on:input={(event) => updateInput(event.target.value)}
                    />
                    <Button variant="secondary" on:click={clearInput}>Очистить</Button>
                </Card.Content>
                <Card.Footer>
                    <Progress value={12} aria-label="12% increase" />
                </Card.Footer>
            </Card.Root>
        {/if}
    </div>

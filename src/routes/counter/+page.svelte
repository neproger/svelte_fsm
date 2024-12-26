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
                            count: ({ context }) => context.count + 5, // Обновление контекста
                        }),
                    },
                    INPUT: {
                        actions: assign({
                            input: ({ event }) => event.data, // Использование данных из события
                        }),
                    },
                    COUNT: {
                        actions: assign({
                            count: ({ event }) => event.data, // Использование данных из события
                        }),
                    },
                    DEACTIVATE: "inactive",
                },
            },
        },
    });
    let service = interpret(machineWithContext);

    let currentState = false;
    let count = 0;
    let input = "";

    service.subscribe((snapshot) => {
        currentState = snapshot.value === "active" ? true : false;
        count = snapshot.context.count;
        input = snapshot.context.input;
    });

    function increment() {
        service.send({ type: "INCREMENT" });
    }

    function toggleState() {
        service.send({
            type: currentState ? "DEACTIVATE" : "ACTIVATE",
        });
    }

    // Пример функции для отправки данных в машину
    function updateInput(newData) {
        service.send({ type: "INPUT", data: newData });
    }

    function clearState() {
        service.send({ type: "COUNT", data: 0 });
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
                <p>{currentState ? "Активно" : "Не активно"}</p>
                Текст: {input || "_"}

            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="text-muted-foreground text-xs">
                {count}% заполнения
            </div>
            <Button variant="secondary" on:click={toggleState}>
                {currentState
                    ? "Деактивировать"
                    : "Активировать"}
            </Button>
        </Card.Content>
        <Card.Footer>
            <Progress value={count} aria-label={`${count}% increase`} />
        </Card.Footer>
    </Card.Root>
</div>
<div class="grid auto-rows-max items-start gap-4 md:gap-8">
    {#if currentState}
        <Card.Root>
            <Card.Header class="pb-2">
                <Card.Title>Настроить состояние</Card.Title>
                <Card.Description>Настройки</Card.Description>
            </Card.Header>
            <Card.Content class="flex flex-col gap-2">
                <Button variant="secondary" on:click={increment}
                    >Увеличить</Button
                >
                
            </Card.Content>
            <Card.Footer class="gap-2">
                <Input
                    class="w-full"
                    type="text"
                    placeholder="Введите текст"
                    value={input}
                    on:input={(event) => updateInput(event.target.value)}
                />
                <Button variant="secondary" on:click={clearState}
                    >Очистить</Button
                >
            </Card.Footer>
        </Card.Root>
    {/if}
</div>

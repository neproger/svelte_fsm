<script>
    import { onMount, onDestroy } from "svelte";
    import { createMachine, assign, interpret } from "xstate";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

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

<div>
    <p>Состояние: {currentState}</p>
    <p>Счетчик: {count}</p>
    <p>Текст: {input || "_"}</p>

    <div class="flex w-full items-center gap-1">
        <Button variant="secondary" on:click={toggleState}>
            {currentState === "inactive" ? "Активировать" : "Деактивировать"}
        </Button>
        {#if currentState === "active"}
            <Button variant="secondary" on:click={increment}>Увеличить</Button>
            <Input
            class="max-w-40"
                type="text"
                placeholder="_"
                value={input}
                on:input={(event) => updateInput(event.target.value)}
            />
            <Button variant="secondary" on:click={clearInput}>Очистить</Button>
        {/if}
    </div>
</div>

<script>
    import { onMount, onDestroy } from "svelte";
    import { createMachine, assign, interpret } from "xstate";

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
        console.log(newData);
        service.send({ type: "INPUT", data: newData });
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
    <p>Текст: {input}</p>
    <button on:click={toggleState}>
        {currentState === "inactive" ? "Активировать" : "Деактивировать"}
    </button>
    {#if currentState === "active"}
        <button on:click={increment}>Увеличить</button>
        <input
            type="text"
            value={input}
            on:input={(event) => updateInput(event.target.value)}
        />
    {/if}
</div>

<script>
    import { createMachine, interpret } from "xstate";

    const machineWithContext = createMachine(
        {
            initial: "inactive",
            context: {
                count: 0,
            },
            states: {
                inactive: {
                    on: { ACTIVATE: "active" },
                },
                active: {
                    on: {
                        INCREMENT: { actions: "incrementCount" },
                        DEACTIVATE: "inactive",
                    },
                    entry: [
                        // Inline action
                        ({ context, event }) => {
                            console.log(/* ... */);
                        },
                    ],
                },
            },
        },
        {
            actions: {
                incrementCount: (context) => {
                    context.count += 1; // Обновляем контекст
                },
            },
        },
    );

    let service = interpret(machineWithContext).start();
    let currentState = "";
    let count = 0;

    service.subscribe((snapshot) => {
        currentState = snapshot.value;
        count = snapshot.context.count;
    });

    function increment() {
        service.send({ type: "INCREMENT" });
    }

    function toggleState() {
        service.send({
            type: currentState === "inactive" ? "ACTIVATE" : "DEACTIVATE",
        });
    }
</script>

<div>
    <p>Состояние: {currentState}</p>
    <p>Счетчик: {count}</p>
    <button on:click={toggleState}>
        {currentState === "inactive" ? "Активировать" : "Деактивировать"}
    </button>
    {#if currentState === "active"}
        <button on:click={increment}>Увеличить</button>
    {/if}
</div>

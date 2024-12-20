<script>

    import { onMount } from "svelte";
    import createFSM from "../lib/fsm";

    const stateMachine = createFSM("red", {
        red: {
            next: "green",
            timeout: 4,
            _enter: (state) => {
                console.log("Вход >>>", state.name, state);
            },
            _exit: (state) => {
                console.log("Выход <<<", state.name, state);
            },
        },
        green: {
            next: "yellow",
            timeout: 4,
            _enter: (state) => {
                console.log("Вход >>>", state.name, state);
            },
            _exit: (state) => {
                console.log("Выход <<<", state.name, state);
            },
        },
        yellow: {
            next: "red",
            timeout: 4,
            _enter: (state) => {
                console.log("Вход >>>", state.name, state);
            },
            _exit: (state) => {
                console.log("Выход <<<", state.name, state);
            },
        },
    });

    let currentState = {};
    let remainingTime = 0;
    let timer;

    const unsubscribe = stateMachine.subscribe((state) => {
        currentState = state;
        // console.log("Все данные текущего состояния", currentState);
        startTimer(state.timeout);
    });

    function transition() {
        stateMachine.invoke("next");
    }

    function startTimer(duration) {
        clearInterval(timer);
        remainingTime = duration; // Устанавливаем время таймера
        timer = setInterval(() => {
            if (remainingTime > 1) {
                remainingTime -= 1;
            } else {
                clearInterval(timer);
                transition();
            }
        }, 1000);
    }

    onMount(() => {
        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    });
</script>

<div style="text-align: center;">
    <button
        class="button"
        style="background-color: {currentState.name}"
        on:click={transition}
    >
        NEXT {remainingTime}
    </button>
</div>

<style>
    .button {
        border-radius: 10px;
        margin-top: 20px;
        padding: 5px 20px;
        font-size: 16px;
        cursor: pointer;
    }
</style>

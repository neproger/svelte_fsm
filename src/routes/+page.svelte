<script>
  import { onMount } from "svelte";
  import { createMachine, createActor, interpret } from "xstate";

  const lightSwitchMachine = createMachine({
    id: "toggle",
    initial: "RED",
    states: {
      RED: {
        context: {
          feedback: "Some feedback",
          rating: 5,
          // other properties
        },
        on: { toggle: "GREEN" },
        after: { 2000: "GREEN" },
      },
      GREEN: {
        on: { toggle: "YELLOW" },
        after: { 2000: "YELLOW" },
      },
      YELLOW: {
        on: { toggle: "RED" },
        after: { 2000: "RED" },
      },
    },
  });
  let service = interpret(lightSwitchMachine);
  let currentState;

  // Subscribe to snapshots (emitted state changes) from the actor
  service.subscribe((snapshot) => {
    currentState = snapshot.value;
    console.log("Value:", snapshot);
  });

  service.start();
  function toggleLight() {
    service.send({ type: "toggle" });
  }
</script>

<div style="text-align: center;">
  <p>Состояние света: {currentState}</p>
  <button on:click={toggleLight} style={`background-color: ${currentState}`}>
    {currentState}
  </button>
</div>

<style>
  button {
    margin-top: 20px;
    padding: 5px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
  }
</style>

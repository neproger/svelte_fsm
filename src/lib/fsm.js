export default function (initialState, states = {}) {
  /*
   * Core Finite State Machine functionality
   * - adheres to Svelte store contract (https://svelte.dev/docs#Store_contract)
   * - invoked events are dispatched to handler of current state
   * - transitions to returned state (or value if static property)
   * - calls _exit() and _enter() methods if they are defined on exited/entered state
   */
  const subscribers = new Set();
  let state = initialState;
  let proxy;

  // Подписка на изменения состояния
  function subscribe(callback) {
    if (!(callback instanceof Function)) {
      throw new TypeError("callback is not a function");
    }
    subscribers.add(callback);
    callback({ name: state, ...states[state] });
    return () => subscribers.delete(callback);
  }

  // Переход в новое состояние
  function transition(newState, event, args) {
    const metadata = {
      from: state,
      to: newState,
      event,
      state: { name: state, ...states[state] }, // Добавляем информацию о текущем состоянии
      args,
    };
    dispatch("_exit", metadata);
    state = newState;
    subscribers.forEach((callback) => callback(state));
    metadata.state = { name: state, ...states[state] }; // Обновляем state для нового состояния
    dispatch("_enter", metadata);
  }

  // Отправка событий
  function dispatch(event, ...args) {
    const action = states[state]?.[event] ?? states["*"]?.[event];
    return action instanceof Function ? action.apply(proxy, args) : action;
  }

  // Обработчик вызова событий
  function invoke(event, ...args) {
    const newState = dispatch(event, ...args)?.valueOf();
    if (["string", "symbol"].includes(typeof newState) && newState !== state) {
      transition(newState, event, args);
    }
    return state;
  }

  /*
   * Дебаунсинг вызовов событий
   */
  const timeout = {};

  async function debounce(event, wait = 100, ...args) {
    clearTimeout(timeout[event]);
    if (wait === null) {
      return state;
    } else {
      await new Promise((resolve) => (timeout[event] = setTimeout(resolve, wait)));
      delete timeout[event];
      return invoke(event, ...args);
    }
  }

  /*
   * Proxy-based event invocation API:
   * - return a proxy object with single native subscribe method
   * - all other properties act as dynamic event invocation methods
   * - event invokers also respond to .debounce(wait, ...args) (see above)
   */
  proxy = new Proxy({ subscribe }, {
    get(target, property) {
      if (!Reflect.has(target, property)) {
        target[property] = invoke.bind(null, property);
        target[property].debounce = debounce.bind(null, property);
      }
      return Reflect.get(target, property);
    },
  });

  /*
   * Вызов _enter для начального состояния
   */
  dispatch("_enter", { from: null, to: state, event: null, args: [], state: { name: state, ...states[state] } });

  return proxy;
}

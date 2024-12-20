function createFSM(initialState, states) {
    let currentState = initialState;
    const subscribers = new Set();

    function transition(event) {
        const stateConfig = states[currentState];
        
        // Проверка, есть ли переход по событию для текущего состояния
        if (stateConfig[event]) {
            const nextState = stateConfig[event];
            
            // Если есть функция _exit, вызываем её для текущего состояния
            if (stateConfig._exit) {
                stateConfig._exit(getCurrentStateData());
            }

            // Переход к новому состоянию
            currentState = nextState;

            // Если есть функция _enter для нового состояния, вызываем её
            if (states[nextState]._enter) {
                states[nextState]._enter(getCurrentStateData());
            }

            // Уведомление подписчиков об изменении состояния
            notify();
        }
    }

    function subscribe(callback) {
        subscribers.add(callback);
        callback(getCurrentStateData()); // Отправляем текущее состояние при подписке
        return () => subscribers.delete(callback);
    }

    function notify() {
        for (const subscriber of subscribers) {
            subscriber(getCurrentStateData()); // Уведомление всех подписчиков
        }
    }

    function getCurrentStateData() {
        const currentStateData = states[currentState];
        
        // Возвращаем все параметры, кроме функций (_enter, _exit)
        const filteredData = Object.fromEntries(
            Object.entries(currentStateData)
                .filter(([key, value]) => typeof value !== 'function')
        );

        return { name: currentState, ...filteredData };
    }

    return {
        invoke: transition,
        subscribe,
    };
}
export default createFSM;

import "./css/Option.css";

function Option({ name, handleSubmit }) {
    const imgPath = "/" + name + ".gif";

    return(
        // onMouseDown gets detected before the focus listeners detect that null gained focus and input lost it
        // Order is mousedown -> -> focus on new elem (or null) -> blur -> mouseup -> click
        // state updates happen asynchronously to the main thread, and so handleSubmit gets called first, uses the old userGuess, then sets the userGuess
        // In terms of scheduling, the entire sequential synchronous code executes first, then the asynchronous code executes after (waiting)
        // When you want your rendering (synchronous) code to use something that results from async computation, you likely need some state that checks if the async is done,
        // then if it is it uses the data, if not, it is in some "loading" state which not only accounts for load time, but also causes re-render on async completion
        /**
         * For the future, state-change calls and fetch calls are asynchronous, they run after the synchronous code, so after all the rendering is done (sometimes you don't 
         * see this happen visually if it happens fast enough, the state gets updated from null to fetched data instantly, trigger an instant re-render)
         * Issue is, when you have a fetch that updates state, updating state re-runs the component code with new state variables, including the fetch
         * Code Runs -> Fetch waits -> Synchronous Render with initial state -> Fetch executes -> Fetch causes state change -> Code runs -> Fetch waits -> Synchronous render 
         * with changed state -> Fetch executes -> Fetch causes state change -> Code runs -> ...
         * We get stuck constantly re-rendering, even though the state data will likely not be changing every time
         * Render = component function executes, so state change triggers re-render = state change re-runs component function
         * 
         * useEffect(() => {
         *     // code here runs only once after the first render
         *     // "don't re-run this code unless something in the array has changed"
         * }, []);
         * 
         * useEffect(() => {
         *   //Runs on every render
         * });
         * 
         * useEffect(() => {
         *   //Runs on the first render
         *   //And any time any dependency value changes
         * }, [prop, state]);
         * 
         * Order:
         * onMouseDown fires.
         * setUserGuess(name) schedules a state update.
         * handleSubmit(e) is synchronous so it runs immediately, reading the old userGuess value while setUserGuess(name) waits.
         * After the event finishes and React re-renders, userGuess actually updates and we re-render (but component doesn't change since this stuff is within events).
         * To get around our problem, just pass the value we need to use in the handleSubmit inside the function itself, not in a state change where the handler would
         * happen first and THEN update the state, this way we actually get the current value
         */
        <div className="Option" onMouseDown={(e) => {handleSubmit(e, name)}}>
            <img src={imgPath} alt="Image" />
            <div className="name">{name}</div>
        </div>
    )
}

export default Option;
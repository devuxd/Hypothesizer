
type hypothesis = {
    tags: String[],
    hypothesis: String,
    AST: { correct: Object, incorrect: Object }
}
const hypotheses: hypothesis[] = [
    {
        tags: ["button", "onclick", "callback", "click"],
        hypothesis: "The callback of onClick is defined incorrectly for your button. Try using onClick={() => function()}",
        AST: {correct:"", incorrect: ""}
    },
    {
        tags: ["button", "onclick", "callback"],
        hypothesis: "Your button callback function does not exist. Make sure that it does in your code.",
        AST: {correct:"", incorrect: ""}
    },
    {
        tags: ["button"],
        hypothesis: "Your button is defined incorrectly in JSX. Make sure you have a closing tag, and check other syntax issues.",
        AST: {correct:"", incorrect: ""}
    },
    {
        tags: ["input", "text", "changing", "type"],
        hypothesis: "You have defined the onChange incorrectly. Make sure that in the onChange attribute of your input, you have an arrow function defined that updates the value of the input.",
        AST: {correct:"", incorrect:""}
    },
    {
        tags: ["state", "update", "immediately", "setState"],
        hypothesis: "React does not manage state synchronously. If you are checking state directly after a call to setState, the state will not appear to have changed.",
        AST: {correct:"", incorrect:""}
    },
    {
        tags: ["error", "found", "cannot", "resolve"],
        hypothesis: "You have not imported the package/component you are trying to use. Make sure, at the top of the code, you have an import _name_ from package_name. ",
        AST: {correct:"", incorrect:""}
    }
]

export { hypotheses };
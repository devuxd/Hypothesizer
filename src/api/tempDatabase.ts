
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
    }
]

export { hypotheses };
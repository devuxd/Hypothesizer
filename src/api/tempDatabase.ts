var data:any = [
    {
        tags: ["button", "onclick", "callback"],
        hypothesis: "The callback of onClick is defined incorrectly for your button. Try using onClick={() => function()}",
        verification: 0
    },
    {
        tags: ["button", "onclick", "callback"],
        hypothesis: "Your button callback function does not exist. Make sure that it does in your code.",
        verification: 1
    },
    {
        tags: ["button"],
        hypothesis: "Your button is defined incorrectly in JSX. Make sure you have a closing tag, and check other syntax issues.",
        verification: 2
    }    
]

export { data };
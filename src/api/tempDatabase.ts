
export type hypothesis = {
    tags: String[],
    hypothesis: String,
    codeBlocks: { correct: codeBlock[], incorrect: codeBlock[] }
}
type codeBlock = {
    expressionRootId: String
    subExpression: {
        expressionName: string,
        expressionValue: String | Object | Boolean | Number | undefined
    }[]
}


const hypotheses: hypothesis[] = [
    {
        tags: ["button", "onclick", "callback", "click"],
        hypothesis: "The callback is defined incorrectly for your event handler. Try using onClick={() => callback()}",
        codeBlocks: {
            incorrect:
                [
                    {
                        expressionRootId: "ArrowFunctionExpression",
                        subExpression:
                            [
                                {
                                    expressionName: "body.type",
                                    expressionValue: "Identifier",
                                },
                                {
                                    expressionName: "body.callee",
                                    expressionValue: undefined
                                },
                                {
                                    expressionName: "body.expression",
                                    expressionValue: undefined
                                },
                                {
                                    expressionName: "body.arguments",
                                    expressionValue: undefined
                                }
                            ]
                    },
                    {
                        expressionRootId: "JSXExpressionContainer",
                        subExpression:
                            [
                                {
                                    expressionName: "expression.callee.type",
                                    expressionValue: "Identifier"
                                },
                                {
                                    expressionName: "expression.arguments",
                                    expressionValue: []
                                }
                            ]
                    }
                ],
            correct: [
                {
                    expressionRootId: "attributes",
                    subExpression: [
                        {
                            expressionName: "name",
                            expressionValue: "onClick"
                        },
                        {
                            expressionName: "value.expression.type",
                            expressionValue: "ArrowFunctionExpression"
                        },
                        {
                            expressionName: "value.expression.body.callee.type",
                            expressionValue: "Identifier"
                        }]
                }]
        }
    },
    // {
    //     tags: ["button", "onclick", "callback"],
    //     hypothesis: "Your button callback function does not exist. Make sure that it does in your code.",
    // },
    // {
    //     tags: ["button"],
    //     hypothesis: "Your button is defined incorrectly in JSX. Make sure you have a closing tag, and check other syntax issues.",
    // },
    // {
    //     tags: ["input", "text", "changing", "type"],
    //     hypothesis: "You have defined the onChange incorrectly. Make sure that in the onChange attribute of your input, you have an arrow function defined that updates the value of the input.",
    // },
    // {
    //     tags: ["state", "update", "immediately", "setState"],
    //     hypothesis: "React does not manage state synchronously. If you are checking state directly after a call to setState, the state will not appear to have changed.",
    // },
    // {
    //     tags: ["error", "found", "cannot", "resolve"],
    //     hypothesis: "You have not imported the package/component you are trying to use. Make sure, at the top of the code, you have an import _name_ from package_name. ",
    // }
]

export { hypotheses };
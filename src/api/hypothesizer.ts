import { analyzeCode } from "./codeAnalyzer";
import { getSourceCodeFiles } from "./devtools";
import { hypotheses, hypothesis } from "./tempDatabase";
import get from 'lodash/get'
const keyword_extractor = require("keyword-extractor");

//  Modified version of  https://gist.github.com/YagoLopez/1c2fe87d255fc64d5f1bf6a920b67484
const getSubTree = (obj: any, key: any, val: any): any[] => {
    let objects: any = [];
    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getSubTree(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj[i]) === -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

const getValues = (obj: any, key: any): any => {
    let objects: any[] = [];
    for (const i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}


const getRelevantAndRankedHypotheses = async (description: String, runTimeMethodsCoverage: any) => {
    console.log(runTimeMethodsCoverage);
    try {
        const files: any[] = await getSourceCodeFiles();
        const astWithTrace = await analyzeCode(runTimeMethodsCoverage, files);
        const hypothesesRanked = await RankHypotheses(description, astWithTrace[0]);
        return [hypothesesRanked, astWithTrace[1]];
    } catch (error) {
        console.error(error);
    }
}

const RankHypotheses = async (description: String, coverageAST: any) => {
    const tags: String[] = getKeywords(description);
    const candidateHypotheses: hypothesis[] = hypotheses.filter(hypothesis => hypothesis.tags.some((tag: String) => tags.includes(tag)));
    const returnedHypotheses: any = [];
    for (const candidateHypothesis of candidateHypotheses) {
        let confidence = 0
        for (const ast of coverageAST) {
            Object.getOwnPropertyNames(candidateHypothesis.codeBlocks).forEach(key => {

                for (const { expressionRootId, subExpression } of candidateHypothesis.codeBlocks[key]) {
                    const relevantSubTrees = getSubTree(ast.node, '', expressionRootId).flat();
                    if (relevantSubTrees.length === 0) continue;
                    let isFound = matchAST(relevantSubTrees, subExpression);
                    if (isFound === "full" && key === "incorrect") {
                        confidence++;
                        break;
                    }
                    if (isFound === "partial" && key === "correct") {
                        confidence++;
                        break;
                    }
                }
            });

        }
        returnedHypotheses.push({ ...candidateHypothesis, confidence })
        console.log(returnedHypotheses)
        return returnedHypotheses;
    }
}


const getKeywords = (sentence: String): String[] => {
    const extraction_result: String[] = keyword_extractor.extract(sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    })
    return extraction_result;
}
const matchAST = (relevantSubTrees: any, subExpression: any) => {
    let found = "none";
    for (const subtree of relevantSubTrees) {
        let countNumberOfOccurrences = 0;
        for (const { expressionName, expressionValue } of subExpression) {
            const objectValues = get(subtree, expressionName);
            if (typeof expressionValue === "object" &&
                typeof objectValues === typeof expressionValue) {
                if (expressionValue.length > 0) {
                    let localCounts = 0;
                    for (const localSubExpression of expressionValue) {
                        for (const objectValue of objectValues) {
                            const localValue = get(objectValue, localSubExpression.expressionName);
                            if (localValue === localSubExpression.expressionValue) {
                                localCounts++;
                            }
                        }


                    }
                    if (localCounts === expressionValue.length) {
                        countNumberOfOccurrences++;
                    }

                } else if (expressionValue.length === 0) {
                    {

                        countNumberOfOccurrences++;
                    }

                }
            }
            else {
                if (objectValues === expressionValue) {
                    countNumberOfOccurrences++;
                }
            }
        }
        if (countNumberOfOccurrences === subExpression.length) {
            found = "full";
            break;
        }
        if (countNumberOfOccurrences < subExpression.length && countNumberOfOccurrences != 0) {
            found = "partial";
        }
    }
    return found;
}

export { getRelevantAndRankedHypotheses, getKeywords }


var Combinatorics = require('js-combinatorics');

export async function getCurrentCombination(result){
    let nums:number[]=[]
    let resultsCount = await result.childElementCount;
    for(let i=0;i< resultsCount;i++){
        await result.child().nth(i).attributes
        let style = await result.child().nth(i).attributes
        let styleString = style["style"]
        const regex = /Symbol_[0-9]/g
        const found = styleString.match(regex)
        switch (found[0]) {
            case "Symbol_0":
                nums.push(0)
                break
            case "Symbol_1":
                nums.push(1)
                break
            case "Symbol_2":
                nums.push(2)
                break
            case "Symbol_3":
                nums.push(3)
                break
        }
    }
    return nums.join(',')
}


export function generateExpectedResultsMap(){
    let subsets = combRep1([0,1,2,3],3)
    let expectedResultsMap = new Map()
    subsets.forEach(function(item){
        let set = new Set(item);
        switch (set.size) {
            case    1:
                expectedResultsMap.set(item.join(','),"Big win, congratulations.")
                break
            case 2:
                expectedResultsMap.set(item.join(','),"Small win, try again to win more.")
                break
            case 3:
                expectedResultsMap.set(item.join(','),"No Win, try again.")
        }
    })

    return expectedResultsMap

}


export function combRep1(arr, l) {
    const baseN = Combinatorics.baseN(arr, l);
    return baseN.toArray()
}


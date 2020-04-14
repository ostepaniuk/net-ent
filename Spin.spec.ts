import {RequestMock, Selector, t} from 'testcafe';
import spinPage from "./pages/spinPage";
import { generateExpectedResultsMap, getCurrentCombination} from "./utils/utils";

const page = new spinPage();
const expectedResultsMap = generateExpectedResultsMap()
let callCount = 0;
const mock = RequestMock()
    .onRequestTo("http://127.0.0.1:8000/outcome.json").respond((req, res) => {
        let array = Array.from(expectedResultsMap.keys())[callCount].split(',').map(Number)
        res.setBody({"value": array})

        if (callCount === Array.from(expectedResultsMap.keys()).length) {
            callCount = 0;
        }
        else {callCount++;}
    }, 200, {"Content-Type": "application/json"})


fixture`Spin with api mocked`
    .page`http://127.0.0.1:8000/`
    .requestHooks(mock);

test('Test all possible symbols combinations with mocked api', async t => {
    let testingResults = new Map
    let spinsCount = 0;
    while (spinsCount < Array.from(expectedResultsMap.keys()).length) {
        await t.expect(page.startB.visible).ok()
        await page.spin();
        await t.expect(page.status.visible).ok()
        await t.expect(page.result.visible).ok()
        let result = await page.getResult();
        const currentResultArray = await getCurrentCombination(result)
        spinsCount++;
        let expectedStatus = expectedResultsMap.get(currentResultArray)
        let actualStatus = await page.status.innerText
        if (actualStatus !== expectedStatus){
            testingResults.set(currentResultArray, [actualStatus, expectedStatus])
        }
    }

    console.log(testingResults)
    await t.expect(testingResults.size).eql(0)
});


fixture`Spin with no api mock being used`
    .page`http://127.0.0.1:8000/`

test('Test sequential number of spins', async t => {

    let testingResults = new Map
    let spinsCount = 0;
    const numberOfSpinsToBeMade = 10
    const resultsToIgnore = ['1,1,1', '0,0,0', '2,2,2', '3,3,3']
    while (spinsCount <=numberOfSpinsToBeMade) {
        await t.expect(page.startB.visible).ok()
        await page.spin();
        await t.expect(page.status.visible).ok()
        await t.expect(page.result.visible).ok()
        let result = await page.getResult();
        const currentResultArray = await getCurrentCombination(result)
        let expectedStatus = expectedResultsMap.get(currentResultArray)
        let actualStatus = await page.status.innerText
        if (resultsToIgnore.some((x => x === currentResultArray))){
            break
        }

        if (actualStatus !== expectedStatus){
            testingResults.set(currentResultArray, [actualStatus, expectedStatus])
        }
        spinsCount++
    }

    console.log(testingResults)
    await t.expect(testingResults.size).eql(0)

});








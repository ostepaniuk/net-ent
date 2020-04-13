import { Selector, t } from 'testcafe';

export default class SpinPage {
    constructor() {
        // Common buttons
        this.startB = Selector('#start');
        this.result = Selector('#result')
        this.status = Selector('#status')
    }

    async spin() {
        await t.click(this.startB);
    }


    async getResult(){
        return this.result;

    }
    

}

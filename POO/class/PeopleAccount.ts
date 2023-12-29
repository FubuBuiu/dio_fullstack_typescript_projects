import { DioAccount } from "./DioAccount";

export class PeopleAccount extends DioAccount {
    doc_id: number
    constructor(name: string, acountNumber: number, doc_id: number) {
        super(name, acountNumber)
        this.doc_id = doc_id;
    }
}
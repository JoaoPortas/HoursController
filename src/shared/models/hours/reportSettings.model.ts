export class ReportSettings {
    patent: string
    commanderName: string
    commanderGender: number
    commanderEspeciality: string

    constructor(patent, commanderName, commanderGender, commanderEspeciality) {
        this.patent = patent
        this.commanderName = commanderName
        this.commanderGender = commanderGender
        this.commanderEspeciality = commanderEspeciality
    }
}

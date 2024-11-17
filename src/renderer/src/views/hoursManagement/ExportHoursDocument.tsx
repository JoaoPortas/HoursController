import React, { FormEvent, useEffect, useState } from "react";

const ExportHoursDocument: React.FC = () => {
    const [years, setYears] = useState<number[]>([]);

    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    const [month, setMonth] = useState<string>("");

    const generateDocument = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement

        let yearElement: HTMLInputElement;
        let monthElement: HTMLInputElement

        yearElement = form.elements.namedItem("year") as HTMLInputElement;
        monthElement = form.elements.namedItem("month") as HTMLInputElement;

        /*let document = await await window.electron.ipcRenderer.invoke(
            "read-file", './resources/template_' + 'female' +'.docx'
        )*/

        //let test = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserMonthlyExtraHoursReport", 1, yearElement.value, monthElement.value);
        let test = await window.electron.ipcRenderer.invoke("/hoursManagement/getAllUsersMonthlyExtraHoursReport", yearElement.value, monthElement.value);
        console.log("TEST:", test);
    };

    useEffect(() => {
        // Generate years from 2023 to current year
        const currentYear = new Date().getFullYear();
        const yearsArray: number[] = [];
        for (let year = currentYear; year >= 2023; year--) {
            yearsArray.push(year);
        }
        setYears(yearsArray);
    }, []);

    return (
        <>
            <main>
            <form onSubmit={generateDocument} style={{marginTop: '20px', marginBottom: '20px'}} className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                        <label className="visually-hidden">Ano</label>
                        <select className="form-select" id="year" name="year">
                            <option disabled>Ano</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="visually-hidden">Preference</label>
                        <select className="form-select" id="month" name="month" defaultValue={currentMonth}>
                            <option disabled>Mês</option>
                            <option value="01">Janeiro</option>
                            <option value="02">Fevereiro</option>
                            <option value="03">Março</option>
                            <option value="04">Abril</option>
                            <option value="05">Maio</option>
                            <option value="06">Junho</option>
                            <option value="07">Julho</option>
                            <option value="08">Agosto</option>
                            <option value="09">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Procurar</button>
                    </div>
                </form>

                <h1>Exportar documento word com as horas para o mês X</h1>
                <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Insira o mês"
                />
                {/*<button onClick={generateDocument}>Exportar Documento</button>*/}
            </main>
        </>
    );
}

export default ExportHoursDocument;

//------------------- Old code ------------------------//
/*import React, { FormEvent, useEffect, useState } from "react";
import { Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, PatchType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { patchDocument } from "docx";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";

// Define the structure of the inner object
interface HoursDetail {
    nip: string
    category: string
    function: string
    name: string
    hoursAt25: number
    hoursAt37Dot5: number
    hoursAt50: number
    hoursAt75: number
    hoursAt50HolyDays: number
    hoursAt100HolyDays: number
}

// Define the structure of the outer object
interface UserHours {
    userId: number
    userHours: HoursDetail
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = monthShortNames[date.getMonth()];
    return `${day} ${month}`;
};

const ExportHoursDocument: React.FC = () => {
    const [years, setYears] = useState<number[]>([]);
    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    const [month, setMonth] = useState<string>("");

    const userHoursStats: UserHours[] = [];

    let yearElement: HTMLInputElement;
    let monthElement: HTMLInputElement

    async function calculateHours(elm: UserExtraHoursViewModel) {
        let fetchTotal = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserTotalHoursExcludingMonthByYear", elm.userID, yearElement.value, /*currentMonth//monthElement.value);
        let totalHours = +fetchTotal;
        //totalHours = fetchTotal;
        //console.log("total", totalHours);
        let hoursFor25 = 0;
        let hoursFor37Dot5 = 0;
        let hoursFor50 = 0;
        let hoursFor75 = 0;
        let hoursFor50HolyDays = 0;
        let hoursFor100HolyDays = 0;

        elm.userHours.forEach((elm: IBaseExtraHoursRegist) => {
            console.log(elm);

            if (elm.extraHours <= 0) return;

            //Se as horas totais forem menor que zero adiciona a primeira a 25% e vê as restantes para adicionar a 37.5 se continuar <100
            if (totalHours < 100) {
                if (elm.dayTypeID === 1) {
                    hoursFor25 += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    if (elm.extraHours > 0) {
                        //Guarda as horas totais atuais para uma variavel para validar se somar se o resto passa ou não das 100
                        let tempTotalHours = totalHours
                        tempTotalHours += elm.extraHours

                        //Se as horas totais + as restantes não passa dos 100 então adiciona a 37.5
                        if (tempTotalHours <= 100) {
                            hoursFor37Dot5 += elm.extraHours
                        }
                        else { //Se as horas totais + as restantes passa dos 100 então calcula quantas horas n passa dos 100 e guarda numa varriável
                            //E calcula as restantes que passam dos 100 e guarda a 50%

                            //Guarda quantas horas que passaram das 100 para adicionar a 75%
                            let restFor75 = tempTotalHours - 100

                            //Tira as horas que têm que ir para os 75% calculadas anteriormente para obter para a var as horas até as 100 que vão continuar nos 37.5%
                            let restFor37Dot5 = elm.extraHours - restFor75

                            hoursFor37Dot5 += restFor37Dot5
                            hoursFor75 += restFor75

                        }
                        totalHours += elm.extraHours
                    }
                }
                else if (elm.dayTypeID === 2 || elm.dayTypeID === 3) {
                    hoursFor50HolyDays += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    if (elm.extraHours > 0) {
                        //Guarda as horas totais atuais para uma variavel para validar se somar se o resto passa ou não das 100
                        let tempTotalHours = totalHours
                        tempTotalHours += elm.extraHours

                        //Se as horas totais + as restantes não passa dos 100 então adiciona a 37.5
                        if (tempTotalHours <= 100) {
                            hoursFor50HolyDays += elm.extraHours
                        }
                        else { //Se as horas totais + as restantes passa dos 100 então calcula quantas horas n passa dos 100 e guarda numa varriável
                            //E calcula as restantes que passam dos 100 e guarda a 50%

                            //Guarda quantas horas que passaram das 100 para adicionar a 75%
                            let restFor100HolyDays = tempTotalHours - 100

                            //Tira as horas que têm que ir para os 75% calculadas anteriormente para obter para a var as horas até as 100 que vão continuar nos 37.5%
                            let restFor50HolyDays = elm.extraHours - restFor100HolyDays

                            hoursFor50HolyDays += restFor50HolyDays
                            hoursFor100HolyDays += restFor100HolyDays

                        }
                        totalHours += elm.extraHours
                    }
                }
            } //Se as horas totais já forem superiores a 100 então pode se adicionar de acordo com as percentagens 50% para a primeira hora e 75 para as restantes
            else {
                if (elm.dayTypeID === 1) {
                    hoursFor50 += 1;
                    elm.extraHours -= 1;
                    totalHours += 1;

                    hoursFor75 += elm.extraHours
                }
                else if (elm.dayTypeID === 2 || elm.dayTypeID === 3) {
                    hoursFor100HolyDays += elm.extraHours;
                }
            }
        });

        let details: HoursDetail = { nip: elm.nip, category: elm.category, function: elm.position, name: elm.name, hoursAt25: hoursFor25, hoursAt37Dot5: hoursFor37Dot5, hoursAt50: hoursFor50, hoursAt75: hoursFor75, hoursAt50HolyDays: hoursFor50HolyDays, hoursAt100HolyDays: hoursFor100HolyDays }
        let uh: UserHours = { userId: elm.userID, userHours: details }
        userHoursStats.push(uh);
        console.log("Details", details);
        console.log("Total Excluding current month:", fetchTotal);
    }

    async function generateHoursRows(usersHoursData: UserExtraHoursViewModel[] | null): Promise<TableRow[]> {
        let hoursRows: TableRow[] = [];

        if (usersHoursData === null) return hoursRows;

        usersHoursData.forEach(async user => {
            calculateHours(user)
            console.log("cacl hours", user);
            user.userHours.forEach(elm => {
                if (elm.morningStartTime !== null && elm.morningEndTime) {
                    hoursRows.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.nip, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    margins: {
                                        top: 50,
                                        bottom: 50
                                    },
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.category, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.position, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                            new TextRun({text: user.name, size: 20, bold: true, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    columnSpan: 2,
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: formatDate(elm.date), size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: elm.morningStartTime, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: elm.morningEndTime, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                            ],
                        })
                    );
                }

                if (elm.afternoonStartTime !== null && elm.afternoonEndTime) {
                    hoursRows.push(
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.nip, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    margins: {
                                        top: 50,
                                        bottom: 50
                                    },
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.category, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: user.position, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        children: [
                                            new TextRun({text: user.name, size: 20, bold: true, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    columnSpan: 2,
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: formatDate(elm.date), size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: elm.afternoonStartTime, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                                new TableCell({
                                    verticalAlign: "center",
                                    children: [new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({text: elm.afternoonEndTime, size: 20, bold: false, font: "Arial"}),
                                        ]
                                    })],
                                }),
                            ],
                        })
                    );
                }
            })
        })

        return hoursRows
    }

    async function generateWorkersRows(usersHoursStatsData: UserHours[]): Promise<TableRow[]> {
        let workersRows: TableRow[] = [];

        console.log("Workers Rows", usersHoursStatsData);
        usersHoursStatsData.forEach((user: UserHours) => {
            console.log("User: ", user);
            workersRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.nip, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: {
                                top: 50,
                                bottom: 50
                            },
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.category, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.function, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({text: user.userHours.name, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt25}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt37Dot5}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt50}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt75}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                    ],
                }),
            )
        })

        return workersRows
    }

    async function generateWorkersHolyDaysRows(usersHoursStatsData: UserHours[]): Promise<TableRow[]> {
        let workersRows: TableRow[] = [];

        usersHoursStatsData.forEach(user => {
            workersRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.nip, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            margins: {
                                top: 50,
                                bottom: 50
                            },
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.category, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: user.userHours.function, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({text: user.userHours.name, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            columnSpan: 2,
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt50HolyDays}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            columnSpan: 2,
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${user.userHours.hoursAt100HolyDays}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                    ],
                }),
            )
        })

        return workersRows
    }

    const generateDocument = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement

        yearElement = form.elements.namedItem("year") as HTMLInputElement;
        monthElement = form.elements.namedItem("month") as HTMLInputElement;

        let document = await await window.electron.ipcRenderer.invoke(
            "read-file", './resources/template_' + 'female' +'.docx'
        )

        const usersHours: UserExtraHoursViewModel[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getAllUsersExtraHoursByYearAndMonth", /*new Date().getFullYear().toString()//yearElement.value, /*currentMonth//monthElement.value) as UserExtraHoursViewModel[];
        const hoursHeaderRow: TableRow = new TableRow({
            children: [
                new TableCell({
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NIP/MÓD.", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    margins: {
                        top: 50,
                        bottom: 50
                    },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "CATEGORIA/", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "CARREIRA", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "FUNÇÕES", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NOME", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    columnSpan: 2,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "Data", size: 20, bold: false, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "Início", size: 20, bold: false, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "Fim", size: 20, bold: false, font: "Tahoma"}),
                        ]
                    })],
                }),
            ],
        });

        const workersMainHeader: TableRow = new TableRow({
            children: [
                new TableCell({

                    verticalAlign: "center",
                    columnSpan: 4,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "FUNCIONÁRIO", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
                new TableCell({

                    margins: {
                        top: 250,
                        bottom: 250
                    },
                    columnSpan: 4,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "HORAS", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "EFECTUADAS", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "(Semana)", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
            ],
        })

        const workersSubHeader: TableRow = new TableRow({
            children: [
                new TableCell({
                    verticalAlign: "center",
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 10
                    },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NIP/MÓD.", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 15
                    },
                    verticalAlign: "center",
                    margins: {
                        top: 50,
                        bottom: 50
                    },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "CATEGORIA/", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "CARREIRA", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 20
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "FUNÇÕES", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 20
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NOME", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 10
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "125%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 10
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "137,5%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 10
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "150%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 10
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "175%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
            ],
        })

        const workersHolyDaysMainHeader: TableRow = new TableRow({
            children: [
                new TableCell({

                    verticalAlign: "center",
                    columnSpan: 4,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "FUNCIONÁRIO", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
                new TableCell({

                    margins: {
                        top: 250,
                        bottom: 250
                    },
                    columnSpan: 4,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "HORAS", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "EFECTUADAS", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "(Fins-de-semana e feriados)", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
            ],
        })

        const workersHolyDaysSubHeader: TableRow = new TableRow({
            children: [
                new TableCell({
                    verticalAlign: "center",
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 10
                    },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NIP/MÓD.", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 15
                    },
                    verticalAlign: "center",
                    margins: {
                        top: 50,
                        bottom: 50
                    },
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "CATEGORIA/", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "CARREIRA", size: 20, bold: true, font: "Tahoma"})
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 20
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "FUNÇÕES", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.PERCENTAGE,
                        size: 25
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "NOME", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 22.5
                    },
                    columnSpan: 2,
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "150%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
                new TableCell({
                    width: {
                        type: WidthType.DXA,
                        size: 22.5
                    },
                    columnSpan: 2,
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "200%", size: 20, bold: true, font: "Tahoma"}),
                        ]
                    })],
                }),
            ],
        })

        //All users hours details rows
        let hoursRows: TableRow[] = [];
        hoursRows.push(hoursHeaderRow)
        let userHoursRowsLoad: TableRow[] = await generateHoursRows(usersHours);
        hoursRows = [...hoursRows, ...userHoursRowsLoad]

        //Workers Stats
        let workersRows: TableRow[] = [];
        workersRows.push(workersMainHeader);
        workersRows.push(workersSubHeader);
        let workersRowsLoad: TableRow[] = await generateWorkersRows(userHoursStats);
        workersRows = [...workersRows, ...workersRowsLoad];

        //Workers HolyDays Stats
        let workersHolyDaysRows: TableRow[] = [];
        workersHolyDaysRows.push(workersHolyDaysMainHeader);
        workersHolyDaysRows.push(workersHolyDaysSubHeader);
        let workersHolyDaysRowsLoad: TableRow[] = await generateWorkersHolyDaysRows(userHoursStats);
        workersHolyDaysRows = [...workersHolyDaysRows, ...workersHolyDaysRowsLoad];

        patchDocument(document, {
            patches: {
                month: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "JANEIRO", bold: true, size: 22})],
                },
                workers_table: {
                    type: PatchType.DOCUMENT,
                    children: [
                        new Table({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 111
                            },
                            rows: [
                                ...workersRows,
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                ...workersHolyDaysRows,
                                //Dados
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                ...hoursRows
                            ],
                        })
                    ],
                },
                indicative: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "O"})],
                },
                sub_day: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "30"})],
                },
                sub_month: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "JANEIRO"})],
                },
                sub_year: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "2020"})],
                },
                capitans_name: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "Nome do cap.", font: "Times New Roman", size: 24})],
                },
                patent: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "Patente", font: "Times New Roman", size: 20})],
                },
                expertise: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: "Especialidade", font: "Times New Roman", size: 20})],
                },
                /*hours_table: {
                    type: PatchType.DOCUMENT,
                    children: [
                        new Table({
                            width: {
                                type: WidthType.PERCENTAGE,
                                size: 111
                            },
                            rows: hoursRows
                        })
                    ],
                },//
            },
        }).then((doc) => {
            const blob = new Blob([doc], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(blob, `Horas_Suplementares_${month}.docx`);
            /*Packer.toBlob(doc).then(blob => {
                saveAs(blob, `Horas_Suplementares_${month}.docx`);
            });//
        });
    };

    useEffect(() => {
        // Generate years from 2023 to current year
        const currentYear = new Date().getFullYear();
        const yearsArray: number[] = [];
        for (let year = currentYear; year >= 2023; year--) {
            yearsArray.push(year);
        }
        setYears(yearsArray);
    }, []);

    return (
        <>
            <main>
            <form onSubmit={generateDocument} style={{marginTop: '20px', marginBottom: '20px'}} className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                        <label className="visually-hidden">Ano</label>
                        <select className="form-select" id="year" name="year">
                            <option disabled>Ano</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="visually-hidden">Preference</label>
                        <select className="form-select" id="month" name="month" defaultValue={currentMonth}>
                            <option disabled>Mês</option>
                            <option value="01">Janeiro</option>
                            <option value="02">Fevereiro</option>
                            <option value="03">Março</option>
                            <option value="04">Abril</option>
                            <option value="05">Maio</option>
                            <option value="06">Junho</option>
                            <option value="07">Julho</option>
                            <option value="08">Agosto</option>
                            <option value="09">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Procurar</button>
                    </div>
                </form>

                <h1>Exportar documento word com as horas para o mês X</h1>
                <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Insira o mês"
                />
                {/*<button onClick={generateDocument}>Exportar Documento</button>//}
            </main>
        </>
    );
};

export default ExportHoursDocument;*/

import React, { useState } from "react";
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
    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    const [month, setMonth] = useState<string>("");

    const userHoursStats: UserHours[] = [];

    async function calculateHours(elm: UserExtraHoursViewModel) {
        let totalHours = 0;
        let hoursFor25 = 0;
        let hoursFor37Dot5 = 0;
        let hoursFor50 = 0;
        let hoursFor75 = 0;

        elm.userHours.forEach((elm: IBaseExtraHoursRegist) => {


            if (elm.extraHours <= 0) return;

            //Se as horas totais forem menor que zero adiciona a primeira a 25% e vê as restantes para adicionar a 37.5 se continuar <100
            if (totalHours < 100) {
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
            } //Se as horas totais já forem superiores a 100 então pode se adicionar de acordo com as percentagens 50% para a primeira hora e 75 para as restantes
            else {
                hoursFor50 += 1;
                elm.extraHours -= 1;
                totalHours += 1;

                hoursFor75 += elm.extraHours
            }
        });

        let details: HoursDetail = { nip: elm.nip, category: elm.category, function: elm.position, name: elm.name, hoursAt25: hoursFor25, hoursAt37Dot5: hoursFor37Dot5, hoursAt50: hoursFor50, hoursAt75: hoursFor75 }
        let uh: UserHours = { userId: elm.userID, userHours: details }
        userHoursStats.push(uh);
    }

    async function generateHoursRows(usersHoursData: UserExtraHoursViewModel[] | null): Promise<TableRow[]> {
        let hoursRows: TableRow[] = [];

        if (usersHoursData === null) return hoursRows;

        usersHoursData.forEach(async user => {
            calculateHours(user)
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
                    ],
                }),
            )
        })

        return workersRows
    }

    const generateDocument = async () => {
        let document = await await window.electron.ipcRenderer.invoke(
            "read-file", './resources/template.docx'
        )

        const usersHours: UserExtraHoursViewModel[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getAllUsersExtraHoursByYearAndMonth", new Date().getFullYear().toString(), currentMonth) as UserExtraHoursViewModel[];

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
                    columnSpan: 3,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "HORAS", size: 20, bold: true, font: "Tahoma"}),
                            new TextRun({break: 1}),
                            new TextRun({text: "EFECTUADAS", size: 20, bold: true, font: "Tahoma"})
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
                        size: 15
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
                        size: 15
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
                        size: 15
                    },
                    verticalAlign: "center",
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({text: "150%", size: 20, bold: true, font: "Tahoma"}),
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
                },*/
            },
        }).then((doc) => {
            const blob = new Blob([doc], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(blob, `Horas_Suplementares_${month}.docx`);
            /*Packer.toBlob(doc).then(blob => {
                saveAs(blob, `Horas_Suplementares_${month}.docx`);
            });*/
        });
    };

    return (
        <>
            <main>
                <h1>Exportar documento word com as horas para o mês X</h1>
                <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Insira o mês"
                />
                <button onClick={generateDocument}>Exportar Documento</button>
            </main>
        </>
    );
};

export default ExportHoursDocument;

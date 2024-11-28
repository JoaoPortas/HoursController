import { UserInfoExtraHoursResume } from "@shared/models/hours/userInfoExtraHoursResume.model";
import React, { FormEvent, useEffect, useState } from "react";
import { Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, PatchType, BorderStyle, patchDocument } from "docx";

import { saveAs } from "file-saver";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { toast } from "react-toastify";
import { ReportSettings } from "@shared/models/hours/reportSettings.model";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthShortNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = monthShortNames[date.getMonth()];
    return `${day} ${month}`;
};

//TODO: Replace the 0s in the hours for week days and holydays/weekend by letting empty
//TODO: Sort the JSON array by nip see https://dev.to/slimpython/sort-array-of-json-object-by-key-value-easily-with-javascript-3hke
//TODO: Get the last day of an month for an year

//-------------- Tables Headers -------------//
//Weekly
const weeklyExtraHoursResumeHeader: TableRow = new TableRow({
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
});

const weeklyExtraHoursResumeSubHeader: TableRow = new TableRow({
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
});

//Weekend and Holydays
const weekendAndHolydayExtraHoursResumeHeader: TableRow = new TableRow({
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
});

const weekendAndHolydayExtraHoursResumeSubHeader: TableRow = new TableRow({
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
});

//Hours Details
const hoursDetailsHeader: TableRow = new TableRow({
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

//-------------- Data ----------------//
async function generateUsersExtraHoursResume(userInfoExtraHoursResume: UserInfoExtraHoursResume[] | null): Promise<TableRow[]> {
        let workersRows: TableRow[] = [];

        if (userInfoExtraHoursResume === null) {
            return workersRows;
        }

        userInfoExtraHoursResume.forEach((info: UserInfoExtraHoursResume) => {
            workersRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: info.number, size: 20, bold: false, font: "Arial"}),
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
                                    new TextRun({text: info.category, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: info.position, size: 20, bold: false, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({text: info.name, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${info.userExtraHoursResume.hoursFor25}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${info.userExtraHoursResume.hoursFor37Dot5}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${info.userExtraHoursResume.hoursFor50}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                        new TableCell({
                            verticalAlign: "center",
                            children: [new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text: `${info.userExtraHoursResume.hoursFor75}`, size: 20, bold: true, font: "Arial"}),
                                ]
                            })],
                        }),
                    ],
                }),
            )
        })

        return workersRows
}

async function generateUsersWeekendAndHolydaysExtraHoursResume(userInfoExtraHoursResume: UserInfoExtraHoursResume[] | null): Promise<TableRow[]> {
    let workersRows: TableRow[] = [];

    if (userInfoExtraHoursResume === null) {
        return workersRows;
    }

    userInfoExtraHoursResume.forEach((info: UserInfoExtraHoursResume) => {
        workersRows.push(
            new TableRow({
                children: [
                    new TableCell({
                        verticalAlign: "center",
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text: info.number, size: 20, bold: false, font: "Arial"}),
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
                                new TextRun({text: info.category, size: 20, bold: false, font: "Arial"}),
                            ]
                        })],
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text: info.position, size: 20, bold: false, font: "Arial"}),
                            ]
                        })],
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        children: [new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({text: info.name, size: 20, bold: true, font: "Arial"}),
                            ]
                        })],
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        columnSpan: 2,
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text: `${info.userExtraHoursResume.hoursFor50HolyDays}`, size: 20, bold: true, font: "Arial"}),
                            ]
                        })],
                    }),
                    new TableCell({
                        verticalAlign: "center",
                        columnSpan: 2,
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text: `${info.userExtraHoursResume.hoursFor100HolyDays}`, size: 20, bold: true, font: "Arial"}),
                            ]
                        })],
                    }),
                ],
            }),
        )
    })

    return workersRows
}

async function generateHoursRows(usersHoursData: UserExtraHoursViewModel[] | null): Promise<TableRow[]> {
    let hoursRows: TableRow[] = [];

    if (usersHoursData === null) return hoursRows;

    usersHoursData.forEach(async user => {
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

const ExportHoursDocument: React.FC = () => {
    const [editReportMetadata, setEditReportMetada] = useState<boolean>(false);
    const handleCheckboxEditReportMetadata = () => {
        setEditReportMetada(!editReportMetadata);
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [years, setYears] = useState<number[]>([]);
    const [currentMonth, _setCurrentMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    );

    const generateDocument = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form: HTMLFormElement = event.target as HTMLFormElement

        let yearElement: HTMLInputElement;
        let monthElement: HTMLSelectElement

        yearElement = form.elements.namedItem("year") as HTMLInputElement;
        monthElement = form.elements.namedItem("month") as HTMLSelectElement;

        let patent: HTMLInputElement = document.getElementById("patent") as HTMLInputElement;
        let capitansName: HTMLInputElement = document.getElementById("capitansName") as HTMLInputElement;
        let capitansGender: HTMLSelectElement = document.getElementById("capitansGender") as HTMLSelectElement;
        let especiality: HTMLInputElement = document.getElementById("especiality") as HTMLInputElement;

        let fileGender: string = "";
        console.log(capitansGender.value);
        if (capitansGender.value == "1") {
            fileGender = "male";
        }
        else {
            fileGender = "female"
        }

        let documentReport = await window.electron.ipcRenderer.invoke(
            "read-file", './resources/template_' + fileGender +'.docx'
        )

        //let test = await window.electron.ipcRenderer.invoke("/hoursManagement/getUserMonthlyExtraHoursReport", 1, yearElement.value, monthElement.value);
        let test: UserInfoExtraHoursResume[] = await window.electron.ipcRenderer.invoke("/hoursManagement/getAllUsersMonthlyExtraHoursReport", yearElement.value, monthElement.value) as UserInfoExtraHoursResume[];

        const usersHours: UserExtraHoursViewModel[] | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getAllUsersExtraHoursByYearAndMonth", yearElement.value, monthElement.value) as UserExtraHoursViewModel[];

        //Weekly Workers Resume Table
        let weeklyWorkersResumeTable: TableRow[] = [];
        weeklyWorkersResumeTable.push(weeklyExtraHoursResumeHeader);
        weeklyWorkersResumeTable.push(weeklyExtraHoursResumeSubHeader);
        let weeklyUsersExtraHoursDataRows: TableRow[] = await generateUsersExtraHoursResume(test);
        weeklyWorkersResumeTable = [...weeklyWorkersResumeTable, ...weeklyUsersExtraHoursDataRows];

        //Weekends And HolyDays Resume Table
        let specialDaysWorkersResumeTable: TableRow[] = [];
        specialDaysWorkersResumeTable.push(weekendAndHolydayExtraHoursResumeHeader);
        specialDaysWorkersResumeTable.push(weekendAndHolydayExtraHoursResumeSubHeader);
        let specialDaysUsersExtraHoursDataRows: TableRow[] = await generateUsersWeekendAndHolydaysExtraHoursResume(test);
        specialDaysWorkersResumeTable = [...specialDaysWorkersResumeTable, ...specialDaysUsersExtraHoursDataRows];

        //All users hours details Table
        let hoursDetailsTable: TableRow[] = [];
        hoursDetailsTable.push(hoursDetailsHeader)
        let userHoursRowsLoad: TableRow[] = await generateHoursRows(usersHours);
        hoursDetailsTable = [...hoursDetailsTable, ...userHoursRowsLoad]

        let generatedDocument: Uint8Array = await patchDocument(documentReport, {
            patches: {
                month: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: monthElement.options[monthElement.selectedIndex].text, bold: true, size: 22, allCaps: true})],
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
                                ...weeklyWorkersResumeTable,
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                ...specialDaysWorkersResumeTable,
                                //Dados
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                new TableRow({children: [new TableCell({borders: {top: {style: BorderStyle.NIL, size: 0, }, bottom: { style: BorderStyle.NIL,size: 0,},
                                    right: {style: BorderStyle.NIL,size: 0,},left: {style: BorderStyle.NIL,size: 0,}},children: [new Paragraph("")],}),],}),
                                ...hoursDetailsTable
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
                    children: [new TextRun({text: capitansName.value, font: "Times New Roman", size: 24})],
                },
                patent: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: patent.value, font: "Times New Roman", size: 20})],
                },
                expertise: {
                    type: PatchType.PARAGRAPH,
                    children: [new TextRun({text: especiality.value, font: "Times New Roman", size: 20})],
                },
            },
        });

        const blob = new Blob([generatedDocument], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        saveAs(blob, `Horas_Suplementares_${monthElement.options[monthElement.selectedIndex].text}.docx`);
    };

    async function saveReportMetadata() {
        setIsLoading(true);

        let patent: HTMLInputElement = document.getElementById("patent") as HTMLInputElement;
        let capitansName: HTMLInputElement = document.getElementById("capitansName") as HTMLInputElement;
        let capitansGender: HTMLSelectElement = document.getElementById("capitansGender") as HTMLSelectElement;
        let especiality: HTMLInputElement = document.getElementById("especiality") as HTMLInputElement;

        let reportMetadataCheckbox: HTMLInputElement = document.getElementById("changeReportMetadataCheckbox") as HTMLInputElement;

        let newMetadata: ReportSettings = new ReportSettings(patent.value, capitansName.value, capitansGender.selectedIndex, especiality.value);

        await window.electron.ipcRenderer.invoke("/hoursManagement/updateReportMetadata", newMetadata) as ReportSettings | null;

        setEditReportMetada(false);
        reportMetadataCheckbox.checked = false;

        toast.success("Novas informações guardadas!");

        setIsLoading(false);
    }

    async function loadReportMetadata() {
        let patent: HTMLInputElement = document.getElementById("patent") as HTMLInputElement;
        let capitansName: HTMLInputElement = document.getElementById("capitansName") as HTMLInputElement;
        let capitansGender: HTMLSelectElement = document.getElementById("capitansGender") as HTMLSelectElement;
        let especiality: HTMLInputElement = document.getElementById("especiality") as HTMLInputElement;

        let reportMetadata: ReportSettings | null = await window.electron.ipcRenderer.invoke("/hoursManagement/getReportMetadata") as ReportSettings | null;

        console.log("meta", reportMetadata);

        patent.value = reportMetadata?.patent ?? "N/A";
        capitansName.value = reportMetadata?.commanderName ?? "N/A";
        capitansGender.selectedIndex = reportMetadata?.commanderGender ?? 1;
        especiality.value = reportMetadata?.commanderEspeciality ?? "N/A";
    }

    useEffect(() => {
        // Generate years from 2023 to current year
        const currentYear = new Date().getFullYear();
        const yearsArray: number[] = [];
        for (let year = currentYear; year >= 2023; year--) {
            yearsArray.push(year);
        }
        setYears(yearsArray);

        loadReportMetadata();
    }, []);

    return (
        <>
            <main>
                <div style={{display: "flex", alignItems: "center"}}>
                    <h1>Gerar Relatório de Horas</h1>
                    <button style={{marginLeft: "15px"}} className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSettings" aria-expanded="false" aria-controls="collapseSettings">
                        Configurações
                    </button>
                </div>
                <form onSubmit={generateDocument} >
                    <div style={{marginTop: '20px', marginBottom: '20px'}} className="row row-cols-lg-auto g-3 align-items-center">
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
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>Gerar Relatório</button>
                        </div>
                    </div>
                    <div id="collapseSettings" style={{marginTop: '20px', marginBottom: '20px', width: "60%", minWidth: "300px", maxWidth: "700px"}} className="row g-3 collapse">
                        <h4>Configurações</h4>
                        <div className="row mb-3">
                            <label htmlFor="capitansName" className="col-sm-4 col-form-label">Data do Documento</label>
                            <div className="col-sm-8">
                                <input type="date" className="form-control" id="date" name="date"/>
                                <div className="invalid-feedback">
                                    *Campo de preenchimento obrigatório
                                </div>
                            </div>
                        </div>
                        <hr style={{marginTop: "5px"}} />
                        <div className="row mb-3">
                            <div className="form-check" style={{paddingLeft: "inherit"}}>
                                <input style={{marginLeft: "0"}} className="form-check-input" type="checkbox" value="" id="changeReportMetadataCheckbox" onChange={handleCheckboxEditReportMetadata}/>
                                <label style={{marginLeft: "10px"}} className="form-check-label" htmlFor="changeReportMetadataCheckbox">
                                    Alterar Dados do Relatório
                                </label>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="patent" className="col-sm-4 col-form-label">Patente</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="patent" name="patent" disabled={!editReportMetadata}/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="capitansName" className="col-sm-4 col-form-label">Nome do Capitão</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="capitansName" name="capitansName" disabled={!editReportMetadata}/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="capitansGender" className="col-sm-4 col-form-label">O/A Comandante</label>
                            <div className="col-sm-8">
                                <select className="form-select" id="capitansGender" name="capitansGender" disabled={!editReportMetadata}>
                                    <option value={1} selected>O</option>
                                    <option value={2}>A</option>
                                </select>
                                <div className="invalid-feedback">
                                    *Campo de preenchimento obrigatório
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="especiality" className="col-sm-4 col-form-label">Especialidade</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="especiality" name="especiality" disabled={!editReportMetadata}/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-sm-4"></div>
                            <div className="col-sm-8">
                                <button type="button" onClick={saveReportMetadata} className="btn btn-primary w-100" disabled={!editReportMetadata}>Guardar Configuração Nova</button>
                                <div className="form-text" style={{marginBottom: "-19px"}}>
                                    Ao guardar esta configuração a mesma será utilizada para relatórios futuros
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}

export default ExportHoursDocument;

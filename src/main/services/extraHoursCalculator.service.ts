import { getUserExtraHoursByYear, getUserExtraHoursByYearAndMonth, getUsersIDsWithExtraHoursInYearAndMonth, getUserTotalHoursExcludingMonthByYear } from "@main/repository/extraHours.repository";
import { getUserById } from "@main/repository/user.repository";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { UserExtraHoursResume } from "@shared/models/hours/userExtraHoursResume.model";
import { UserInfoExtraHoursResume } from "@shared/models/hours/userInfoExtraHoursResume.model";
import { IUser } from "@shared/models/interfaces/user.interface";



async function calculateUserExtraHoursMonthlyResume(userID: number, currentAccumulatedHours: number, userHours: IBaseExtraHoursRegist[] | null): Promise<UserExtraHoursResume> {
    if (userHours === null) {
        return new UserExtraHoursResume(userID, 0, 0, 0, 0, 0, 0);
    }

    let totalHours = +currentAccumulatedHours;
    //totalHours = fetchTotal;
    //console.log("total", totalHours);
    let hoursFor25 = 0;
    let hoursFor37Dot5 = 0;
    let hoursFor50 = 0;
    let hoursFor75 = 0;
    let hoursFor50HolyDays = 0;
    let hoursFor100HolyDays = 0;

    userHours.forEach((elm: IBaseExtraHoursRegist) => {
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

    return new UserExtraHoursResume(userID, hoursFor25, hoursFor37Dot5, hoursFor50, hoursFor75, hoursFor50HolyDays, hoursFor100HolyDays);
}

//TODO: Add an equal function but what works for an entiry year
export async function getUserMonthlyExtraHoursReport(userID: number, year: string, month: string): Promise<UserInfoExtraHoursResume> {
    let currentUserTotalHours: number | null = await getUserTotalHoursExcludingMonthByYear(userID, year, month);
    if (currentUserTotalHours === null) currentUserTotalHours = 0;

    let userHours: IBaseExtraHoursRegist[] | null = await getUserExtraHoursByYearAndMonth(userID, year, month);
    console.log(userHours);
    let extraHoursResume: UserExtraHoursResume = await calculateUserExtraHoursMonthlyResume(userID, currentUserTotalHours, userHours);

    let user: IUser | null = await getUserById(userID);
    let userInfoExtraHoursResume: UserInfoExtraHoursResume = new UserInfoExtraHoursResume(userID, user?.number ?? "n/a", user?.category ?? "n/a", user?.position ?? "n/a", user?.name ?? "n/a", extraHoursResume);

    return userInfoExtraHoursResume;
}

export async function getAllUsersMonthlyExtraHoursReport(year: string, month: string): Promise<Array<UserInfoExtraHoursResume>> {
    // Retrieve users with extra hours
    let usersWithHours: number[] = await getUsersIDsWithExtraHoursInYearAndMonth(year, month);

    // Use `map` to create an array of promises for each user's report
    let promises = usersWithHours.map(async (userID: number) => {
        console.log(userID);
        return await getUserMonthlyExtraHoursReport(userID, year, month);
    });

    // Wait for all promises to resolve and return the results
    let usersInfoExtraHoursResumes: UserInfoExtraHoursResume[] = await Promise.all(promises);

    return usersInfoExtraHoursResumes;
}

export async function getUserAnnualExtraHoursReport(userID: number, year: string): Promise<UserInfoExtraHoursResume> {
    let userHours: IBaseExtraHoursRegist[] | null = await getUserExtraHoursByYear(userID, year);

    let extraHoursResume: UserExtraHoursResume = await calculateUserExtraHoursMonthlyResume(userID, 0, userHours);

    let user: IUser | null = await getUserById(userID);
    let userInfoExtraHoursResume: UserInfoExtraHoursResume = new UserInfoExtraHoursResume(userID, user?.number ?? "n/a", user?.category ?? "n/a", user?.position ?? "n/a", user?.name ?? "n/a", extraHoursResume);

    return userInfoExtraHoursResume;
}

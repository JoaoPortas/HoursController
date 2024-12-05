import { IUser } from '@shared/models/interfaces/user.interface';
import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<Array<IUser>>();

    async function resetPassword(userID: number, name: string) {
        await toast.promise(
            window.electron.ipcRenderer.invoke("/admin/resetUserPassword", userID) as Promise<boolean>,
            {
              pending: 'A redefenir código de acesso...',
              success: "Código de acesso de " + name + " removido! Este utilizador pode agora aceder sem código de acesso",
              error: 'Erro ao rdefenir código de acesso'
            }
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            const data: Array<IUser> = await window.electron.ipcRenderer.invoke("/admin/getAllUsersInfo") as Array<IUser>;
            setUsers(data);
        };
        fetchData();
    }, []);

    return (
        <main>
            <h1>Gestão de Utilizadores</h1>

            <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>Ações</td>
                            <td>ID</td>
                            <td>NIP/MÓD.</td>
                            <td>Nome</td>
                        </tr>
                    </thead>
                    <tbody>
                    {users && users.map((user: IUser, index) => (
                        <Fragment key={index}>
                            <tr>
                                <td><button onClick={() => resetPassword(user.userId, user.name)}>Reset Password</button></td>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.number}</td>
                            </tr>
                        </Fragment>
                    ))}
                    </tbody>
                </table>
        </main>
    )
}

export default UsersManagement
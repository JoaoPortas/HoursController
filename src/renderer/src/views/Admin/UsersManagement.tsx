import { IUser } from '@shared/models/interfaces/user.interface';
import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<Array<IUser>>();

    async function resetPassword() {
        toast.success("Código de acesso removido! Este utilizador pode agora aceder sem código de acesso");
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
            <h1>Users Management</h1>

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
                                <td><button onClick={resetPassword}>Reset Password</button></td>
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
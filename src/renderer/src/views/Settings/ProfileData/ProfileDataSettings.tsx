import UpdatateUserPasswordForm from '@renderer/components/userSettings/updateUserPasswordForm'
import UserPersonalInfoForm from '@renderer/components/userSettings/userPersonalInfoUpdateForm'
import React from 'react'

const ProfileDataSettings: React.FC = () => {
    

    return (
        <main>
            {/*<div style={{width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <UserPersonalInfoForm />
                <UpdatateUserPasswordForm />
            </div>*/}
            <div className="container my-4">
                <div className="row">
                    {/* Vertical Pills Navigation */}
                    <div className="col-md-3">
                    <ul
                        className="nav nav-pills flex-column"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                    >
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="v-pills-home-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#v-pills-home"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-home"
                            aria-selected="true"
                            style={{width: "150px"}}
                        >
                            Informações
                        </button>
                        </li>
                        <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="v-pills-profile-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#v-pills-profile"
                            type="button"
                            role="tab"
                            aria-controls="v-pills-profile"
                            aria-selected="false"
                            style={{width: "150px"}}
                        >
                            Segurança
                        </button>
                        </li>
                    </ul>
                    </div>

                    {/* Tab Content */}
                    <div className="col-md-9">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="v-pills-home"
                            role="tabpanel"
                            aria-labelledby="v-pills-home-tab"
                        >
                            <UserPersonalInfoForm />
                        </div>
                        <div
                        className="tab-pane fade"
                        id="v-pills-profile"
                        role="tabpanel"
                        aria-labelledby="v-pills-profile-tab"
                        >
                            <UpdatateUserPasswordForm />
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        </main>
    )
}

export default ProfileDataSettings
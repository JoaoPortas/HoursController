import UpdatateUserPasswordForm from '@renderer/components/userSettings/updateUserPasswordForm'
import UserPersonalInfoForm from '@renderer/components/userSettings/userPersonalInfoUpdateForm'
import React from 'react'

const ProfileDataSettings: React.FC = () => {
    

    return (
        <main>
            <div style={{width: "60%", minWidth: "300px", maxWidth: "700px"}}>
                <UserPersonalInfoForm />
                <UpdatateUserPasswordForm />
            </div>
        </main>
    )
}

export default ProfileDataSettings
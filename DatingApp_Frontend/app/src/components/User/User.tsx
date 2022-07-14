import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { UserCard } from './UserCard';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUser, IUserContext } from '../../interfaces/Interfaces';

interface IProps {
    match: { params: { id: number } },
    history: string[]
}

export const User = ({ match, history }: IProps): JSX.Element => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext<IUserContext>(UserContext);
    const { timderFetch } = useTimderApi();

    const [user, setUser] = useState<IUser>();
    const [loading, setLoading] = useState(true);
    const [isSelf, setIsSelf] = useState<boolean>(false);

    const messageUser = () => {
        history.push("/thread/" + user!.id); // redirect to thread
    }

    const unlikeUser = async () => {
        await timderFetch("DELETE", `v1/users/${userContext.jwtID}/like/${userID}`, "")
        .then(res => {
            history.push("/matches"); // redirect to matches
        })
    }

    useEffect(() => {
        async function getUser() {
            await timderFetch("GET", `v1/users/${userID}`, "")
            .then(res => res.json())
            .then((user: IUser) => {
                setUser({ ...user });
                if(user.id === +userContext.jwtID) {
                    setIsSelf(true)
                }
                setLoading(false);
            })
            .catch(err => console.error(err))
        }
        getUser();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="page user">
            <div className="content">
                { isSelf && <h2>Profile</h2> }
                {
                    !loading &&
                    <UserCard
                    user={user!}
                    isSelf={isSelf}
                    canBeMessaged={!isSelf}
                    messageUser={messageUser}
                    canBeUnliked={!isSelf}
                    unlikeUser={unlikeUser}
                    />
                }
            </div>
        </div>
    )
}

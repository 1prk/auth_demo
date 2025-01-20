import UserService from "../services/UserService";

export default function Public () {
    return(
        <>
        <div className={"public"}>
            Ich habe Geheimnisse!
        </div>
            <button onClick={() => UserService.doLogin()}>Lass mich rein!</button>
        </>
    )
}
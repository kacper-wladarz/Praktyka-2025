interface GlobalContextInterface {
    JWT: string | null;
    setJWT: React.Dispatch<SetStateAction<string | null>>;
}

interface LoginData {
    login: string;
    password: string;
}

interface RegistrationData {
    login: string;
    password: string;
    repeatPassword: string;
}
